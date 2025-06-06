import { defineStore } from 'pinia';
import { useNotificationStore } from './notification';
import axios from "axios";
import { jsPDF } from "jspdf";

import { useUserStore } from './user';

export const useProjectStore = defineStore("project", {
    state: () => ({
        projects: [],
        books: [],
        chapters: [],
        fragments: [],
        isProjectSearchOpen: false,
        isExportingPdf: false,
    }),
    actions: {
        async fetchProjects() {
            const userStorage = useUserStore();
            const userId = userStorage.user.id;

            if (!userId) {
                this.projects = [];
                return;
            }
            try {
                const projects = await axios.get("http://localhost:3000/projects", {
                    params: { userId }
                });
                this.projects = projects.data;
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        },

        fetchProjectTitle(projectId) {
            const project = this.projects.find(p => p.id === projectId);
            if (project) {
                return project.title;
            } else {
                console.error("Project not found in store");
                return null;
            }
        },

        async fetchProjectById(projectId, userId) {
            const existing = this.projects.find(p => p.id === projectId);
            if (existing) return existing;

            try {
                const response = await axios.get("http://localhost:3000/projects/getProjectById", {
                    params: { projectId, userId }
                });
                if (response.data) {
                    this.projects.push(response.data);
                    return response.data;
                } else {
                    return null;
                }
            } catch (error) {
                console.error("Error fetching project:", error);
                return null;
            }
        },

        async fetchProjectBibleBooks(projectId) {
            try {
                const response = await axios.get(`http://localhost:3000/projects/biblebooks/${projectId}/books`);
                const existing = this.books.find(b => b.id === projectId);
                if (existing) {
                    existing.bibleBooks = response.data;
                } else {
                    this.books.push({
                        id: projectId,
                        bibleBooks: response.data,
                    });
                }

            } catch (error) {
                console.error(`Error fetching Bible Books for project ${projectId}:`, error);
            }
        },

        async fetchProjectBookChapters(projectId, bookId) {
            try {
                const response = await axios.get(`http://localhost:3000/projects/biblebooks/${bookId}/chapters`);
                const existing = this.chapters.find(c => c.id === projectId);
                if (existing) {
                    existing.bibleChapters = response.data;
                } else {
                    this.chapters.push({
                        id: projectId,
                        bibleChapters: response.data,
                    });
                }
            } catch (error) {
                console.error(`Error fetching Bible Chapters for project ${projectId}:`, error);
            }
        },

        async fetchProjectFragments(projectId, userId) {
            try {
                const response = await axios.get(`http://localhost:3000/projects/${projectId}/fragments`);
                const existing = this.fragments.find(f => f.id === projectId);
                if (existing) {
                    existing.fragments = response.data;
                } else {
                    this.fragments.push({
                        id: projectId,
                        fragments: response.data,
                    });
                }
            } catch (error) {
                console.error(`Error fetching Fragments for project ${projectId}:`, error);
            }
        },

        async fetchChapterFragments(projectId, chapterId) {
            try {
                const response = await axios.get(`http://localhost:3000/projects/biblechapters/${chapterId}/fragments`);
                const existing = this.fragments.find(f => f.id === projectId);
                if (existing) {
                    existing.bibleFragments = response.data;
                } else {
                    this.fragments.push({
                        id: projectId,
                        bibleFragments: response.data,
                    });
                }
            } catch (error) {
                console.error(`Error fetching Bible Fragments for project ${projectId}:`, error);
            }
        },

        async addProject(project) {
            const userStorage = useUserStore();
            const user = userStorage.user;

            const newProject = {
                title: project.title,
                type: project.type,
                hasUpdates: false,
                userId: user.id,
                ...(project.text != null && { text: project.text }),
                ...(project.version != null && { version: project.version }),
                ...(project.selectedBooks != null && { selectedBooks: project.selectedBooks })
            };

            try {
                const response = await axios.post("http://localhost:3000/projects", newProject, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                this.projects.push({
                    ...newProject,
                    id: response.data.id,
                    createdAt: response.data.createdAt,
                    updatedAt: response.data.updatedAt,
                });
                this.fetchProjects();
            } catch (error) {
                console.error("Error adding project:", error);
            }

        },

        async addComment({ fragmentId, content, status, isSuggestion, projectId }) {
            const userStore = useUserStore();
            const notificationStore = useNotificationStore();
            try {
                const response = await axios.post("http://localhost:3000/comments", {
                    fragmentId,
                    content,
                    status,
                    isSuggestion,
                    userId: userStore.user.id,
                    userEmail: userStore.user.email,
                }, {
                    headers: { "Content-Type": "application/json" }
                });

                const newComment = response.data;
                if (newComment.status === "public") {
                    await notificationStore.sendCommentNotification({
                        projectId: projectId,
                        fragmentId: newComment.fragmentId,
                        senderId: userStore.user.id,
                        senderEmail: userStore.user.email
                    });
                }
            } catch (error) {
                console.error("Error adding comment:", error);
                throw error;
            }
        },

        async deleteProject(projectId, emittingUserId) {
            const projectIndex = this.projects.findIndex((project) => project.id === projectId);
            let originalProjects = [...this.projects];

            if (projectIndex !== -1) {
                this.projects.splice(projectIndex, 1);
            }
            try {
                await axios.delete("http://localhost:3000/projects", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: { projectId, emittingUserId }
                });
            } catch (error) {
                this.projects = originalProjects;
                console.error("Error deleting project via API:", error);
                throw error;
            }
        },

        removeProjectById(projectId) {
            const projectIndex = this.projects.findIndex((project) => project.id === projectId);
            if (projectIndex !== -1) {
                this.projects.splice(projectIndex, 1);
            }
        },

        async deleteComment(commentId, fragmentIdPassedFromComponent) {
            try {
                await axios.delete("http://localhost:3000/comments", {
                    headers: { "Content-Type": "application/json" },
                    data: { commentId }
                });

                let foundAndRemoved = false;
                for (const fragmentGroup of this.fragments) {
                    let fragsArray = [];
                    if (fragmentGroup.bibleFragments && fragmentGroup.bibleFragments.length > 0) {
                        fragsArray = fragmentGroup.bibleFragments;
                    } else if (fragmentGroup.fragments && fragmentGroup.fragments.length > 0) {
                        fragsArray = fragmentGroup.fragments;
                    }

                    const fragment = fragsArray.find(f => f.id === fragmentIdPassedFromComponent);
                    if (fragment && fragment.comments) {
                        const index = fragment.comments.findIndex(c => c.id === commentId);
                        if (index !== -1) {
                            fragment.comments.splice(index, 1);
                            foundAndRemoved = true;
                            break;
                        }
                    }
                }
                if (!foundAndRemoved) {
                    console.warn(`Store: Comment ${commentId} in fragment ${fragmentIdPassedFromComponent} not found for local removal.`);
                }
            } catch (error) {
                console.error("Error deleting comment in store:", error);
                throw error;
            }
        },

        async updateComment(commentId, newContent) {
            try {
                const response = await axios.post("http://localhost:3000/comments/update", {
                    commentId,
                    content: newContent
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                const updatedCommentFromAPI = response.data;

                let foundAndUpdateInStore = false;
                for (const fragmentGroup of this.fragments) {
                    let fragsArray = [];
                    if (fragmentGroup.bibleFragments && fragmentGroup.bibleFragments.length > 0) {
                        fragsArray = fragmentGroup.bibleFragments;
                    } else if (fragmentGroup.fragments && fragmentGroup.fragments.length > 0) {
                        fragsArray = fragmentGroup.fragments;
                    }
                    for (const fragment of fragsArray) {
                        if (fragment.comments) {
                            const commentIndex = fragment.comments.findIndex(c => c.id === commentId);
                            if (commentIndex !== -1) {
                                fragment.comments[commentIndex] = { ...fragment.comments[commentIndex], ...updatedCommentFromAPI };
                                foundAndUpdateInStore = true;
                                break;
                            }
                        }
                    }
                    if (foundAndUpdateInStore) {
                        break;
                    }
                }
                if (!foundAndUpdateInStore) {
                    console.warn(`Store: Comment ${commentId} not found for local update after API success.`);
                }
                return updatedCommentFromAPI;
            } catch (error) {
                console.error("Error updating comment in store (POST):", error);
                throw error;
            }
        },

        async toggleCommentStatus(commentId) {
            const userStore = useUserStore();
            const notificationStore = useNotificationStore();

            try {
                const response = await axios.post("http://localhost:3000/comments/toggle-status", {
                    commentId
                }, {
                    headers: { "Content-Type": "application/json" }
                });

                const updatedComment = response.data;

                if (!updatedComment || typeof updatedComment.status === 'undefined' || typeof updatedComment.fragmentId === 'undefined') {
                    console.error("toggleCommentStatus: API did not return a valid updated comment with status and fragmentId.");
                    return;
                }

                let foundAndUpdateInStore = false;
                for (const fragmentGroup of this.fragments) {
                    let fragsArray = fragmentGroup.bibleFragments || fragmentGroup.fragments || [];
                    for (const fragment of fragsArray) {
                        if (fragment.comments) {
                            const commentIndex = fragment.comments.findIndex(c => c.id === updatedComment.id);
                            if (commentIndex !== -1) {
                                fragment.comments[commentIndex] = { ...fragment.comments[commentIndex], ...updatedComment };
                                foundAndUpdateInStore = true;
                                break;
                            }
                        }
                    }
                    if (foundAndUpdateInStore) break;
                }

                if (updatedComment.status === "public") {
                    let finalProjectId = null;
                    if (updatedComment.fragment && updatedComment.fragment.projectId) {
                        finalProjectId = updatedComment.fragment.projectId;
                    } else {
                        outerLoop: for (const fg of this.fragments) {
                            const frags = fg.bibleFragments || fg.fragments || [];
                            for (const frag of frags) {
                                if (frag.id === updatedComment.fragmentId) {
                                    finalProjectId = fg.id; // fg.id este projectId-ul grupului
                                    break outerLoop;
                                }
                            }
                        }
                    }

                    if (finalProjectId) {
                        await notificationStore.sendCommentNotification({
                            projectId: finalProjectId,
                            fragmentId: updatedComment.fragmentId,
                            senderId: userStore.user.id,
                            senderEmail: userStore.user.email
                        });
                    } else {
                        console.error("toggleCommentStatus: Could not determine projectId for notification.");
                    }
                }
            } catch (error) {
                console.error("Error toggling comment status:", error);
                throw error;
            }
        },

        async toggleCommentSuggestion(commentId) {
            try {
                const response = await axios.post("http://localhost:3000/comments/toggle-suggestion", {
                    commentId,
                }, {
                    headers: { "Content-Type": "application/json" }
                });

                const updatedComment = response.data;

                let foundAndUpdateInStore = false;
                for (const fragmentGroup of this.fragments) {
                    let fragsArray = fragmentGroup.bibleFragments || fragmentGroup.fragments || [];
                    for (const fragment of fragsArray) {
                        if (fragment.comments) {
                            const commentIndex = fragment.comments.findIndex(c => c.id === updatedComment.id);
                            if (commentIndex !== -1) {
                                fragment.comments[commentIndex] = { ...fragment.comments[commentIndex], ...updatedComment };
                                if (updatedComment.content) {
                                    fragment.content = updatedComment.content;
                                }
                                foundAndUpdateInStore = true;
                                break;
                            }
                        }
                    }
                    if (foundAndUpdateInStore) break;
                }

                return updatedComment;
            } catch (error) {
                console.error("Error toggling comment suggestion:", error);
                throw error;
            }
        },

        async deleteBibleBook(bookId) {
            const projectId = this.books.find(b => b.bibleBooks.some(bb => bb.id === bookId)).id;

            const bookIndex = this.books.findIndex(b => b.id === projectId);
            if (bookIndex !== -1) {
                this.books[bookIndex].bibleBooks = this.books[bookIndex].bibleBooks.filter(b => b.id !== bookId);
            }

            try {
                await axios.delete("http://localhost:3000/projects/biblebooks", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: { bookId }
                });
                return true;
            } catch (error) {
                console.error("Error deleting Bible Book:", error);
                return false;
            }
        },

        async deleteBibleChapter(chapterId) {
            const chapterContainer = this.chapters.find(c => c.id === this.selectedProjectId);
            if (chapterContainer) {
                chapterContainer.bibleChapters = chapterContainer.bibleChapters.filter(ch => ch.id !== chapterId);
            }

            try {
                await axios.delete("http://localhost:3000/projects/biblechapters", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: { chapterId }
                });
                return true;
            } catch (error) {
                console.error("Error deleting Bible Chapter:", error);
                return false;
            }
        },

        async addCollaborator(email, projectId) {
            try {
                await axios.post("http://localhost:3000/projects/add-collaborator", {
                    email,
                    projectId
                });

                const project = this.projects.find(p => p.id === projectId);
                if (project) {
                    if (!project.collaborators) {
                        project.collaborators = [];
                    }
                    project.collaborators.push({ email });
                }

                this.fetchProjects();
            } catch (error) {
                console.error("Error adding collaborator:", error);
                throw new Error("Failed to add collaborator.");
            }
        },

        toggleProjectSearch() {
            this.isProjectSearchOpen = !this.isProjectSearchOpen;
        },

        async exportProjectToPdf(projectId) {
            this.isExportingPdf = true;
            try {
                const currentProjectId = parseInt(projectId, 10);
                const project = this.projects.find(p => p.id === currentProjectId);
                if (!project) {
                    throw new Error("Proiectul nu a fost găsit pentru export PDF.");
                }
                let collectedFragmentsForPdf = [];
                const needsBibleFetch = project.type === 'Biblia';
                const needsGenericFetch = project.type !== 'Biblia';

                if (needsBibleFetch) {
                    await this.fetchProjectBibleBooks(currentProjectId);
                    const booksEntry = this.books.find(b => b.id === currentProjectId);
                    if (booksEntry && booksEntry.bibleBooks && booksEntry.bibleBooks.length > 0) {
                        for (const book of booksEntry.bibleBooks) {
                            if (!book.id) continue;
                            const cleanBookTitle = (book.title || "Carte Necunoscută").startsWith("Book")
                                ? (book.title || "Carte Necunoscută").substring(4)
                                : (book.title || "Carte Necunoscută");
                            let chaptersForThisBook = [];
                            try {
                                const chaptersResponse = await axios.get(`http://localhost:3000/projects/biblebooks/${book.id}/chapters`);
                                chaptersForThisBook = chaptersResponse.data || [];
                            } catch (error) { console.warn(`Eroare fetch capitole pt carte ${book.id}`); continue; }

                            for (const chapter of chaptersForThisBook) {
                                if (!chapter.id) continue;
                                const chapterIdentifier = chapter.title || chapter.number || chapter.id;
                                let fragmentsForThisChapter = [];
                                try {
                                    const fragmentsResponse = await axios.get(`http://localhost:3000/projects/biblechapters/${chapter.id}/fragments`);
                                    fragmentsForThisChapter = fragmentsResponse.data || [];
                                } catch (error) { console.warn(`Eroare fetch fragmente pt capitol ${chapter.id}`); continue; }

                                if (fragmentsForThisChapter.length > 0) {
                                    const enrichedFragments = fragmentsForThisChapter.map(frag => ({
                                        ...frag,
                                        bookName: cleanBookTitle,
                                        chapterNumber: chapterIdentifier,
                                    }));
                                    collectedFragmentsForPdf.push(...enrichedFragments);
                                }
                            }
                        }
                    }
                } else if (needsGenericFetch) {
                    try {
                        const response = await axios.get(`http://localhost:3000/projects/${currentProjectId}/fragments`);
                        const genericFragmentsData = response.data || [];
                        if (genericFragmentsData.length > 0) {
                            collectedFragmentsForPdf.push(...genericFragmentsData);
                        }
                    } catch (error) { console.warn(`Eroare fetch fragmente pt proiect generic ${currentProjectId}`); }
                }
                const fragmentsToExport = collectedFragmentsForPdf;

                if (fragmentsToExport.length === 0 && project) {
                    console.warn(`Proiectul "${project.title}" nu are fragmente de exportat.`);
                }

                const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

                let robotoFontLoaded = false;
                const ROBOTO_FONT_FAMILY_NAME = 'RobotoLoaded';

                const fontFilesToLoad = [
                    { path: '/fonts/Roboto-Regular.ttf', name: ROBOTO_FONT_FAMILY_NAME, style: 'normal' },
                    { path: '/fonts/Roboto-Bold.ttf', name: ROBOTO_FONT_FAMILY_NAME, style: 'bold' },
                    { path: '/fonts/Roboto-Italic.ttf', name: ROBOTO_FONT_FAMILY_NAME, style: 'italic' },
                    { path: '/fonts/Roboto-BoldItalic.ttf', name: ROBOTO_FONT_FAMILY_NAME, style: 'bolditalic' }
                ];

                try {
                    for (const fontInfo of fontFilesToLoad) {
                        const response = await fetch(fontInfo.path);
                        if (!response.ok) throw new Error(`Nu s-a putut încărca ${fontInfo.path}: ${response.statusText}`);
                        const fontBlob = await response.blob();
                        const reader = new FileReader();
                        await new Promise((resolve, reject) => {
                            reader.onloadend = () => {
                                const fontBase64 = (reader.result).split(',')[1];
                                const vfsPath = `${fontInfo.name}-${fontInfo.style}.ttf`;
                                doc.addFileToVFS(vfsPath, fontBase64);
                                doc.addFont(vfsPath, fontInfo.name, fontInfo.style);
                                resolve();
                            };
                            reader.onerror = reject;
                            reader.readAsDataURL(fontBlob);
                        });
                    }
                    robotoFontLoaded = true;
                    doc.setFont(ROBOTO_FONT_FAMILY_NAME, 'normal');
                } catch (fontError) {
                    console.error("[PDF Font] Eroare la încărcarea fonturilor Roboto. Se va folosi fontul default.", fontError);
                    doc.setFont('Helvetica', 'normal');
                }

                const pageHeight = doc.internal.pageSize.getHeight();
                const pageWidth = doc.internal.pageSize.getWidth();
                const margin = 15;
                let currentY = margin;

                const baseLineHeight = 5.5;
                const titleFontSize = 16;
                const metaFontSize = 9;
                const bookTitleFontSize = 14;
                const chapterTitleFontSize = 12;
                const verseNumberFontSize = 9.5;
                const contentTextFontSize = 10;

                const fragmentPrefixFontSize = 11;
                const fragmentPrefixColor = '#1a237e';

                const titleColor = '#333333';
                const metaColor = '#666666';
                const bookTitleColor = '#004D40';
                const chapterTitleColor = '#00695C';
                const verseNumberColor = '#555555';
                const contentTextColor = '#212529';

                const addTextWithWrap = (text, x, options = {}) => {
                    const textToDraw = String(text || "");
                    if (textToDraw.trim() === "" && !options.allowEmpty) {
                        if (options.addSpacingAfter && typeof currentY === 'number' && !isNaN(currentY)) {
                            currentY += (options.addSpacingAfter * baseLineHeight);
                        }
                        return;
                    }
                    const fontSize = options.fontSize || contentTextFontSize;
                    const fontStyleOption = options.fontStyle || 'normal';
                    const color = options.color || contentTextColor;
                    const align = options.align || 'left';
                    const effectiveLineHeight = (options.lineHeightFactor || 1.2) * baseLineHeight * (fontSize / contentTextFontSize);

                    doc.setFont(ROBOTO_FONT_FAMILY_NAME, fontStyleOption);
                    doc.setFontSize(fontSize);
                    doc.setTextColor(color);

                    const textWidth = align === 'center' ? pageWidth - 2 * margin : pageWidth - margin - x;
                    const lines = doc.splitTextToSize(textToDraw, textWidth <= 0 ? 1 : textWidth);

                    lines.forEach((line) => {
                        if (typeof currentY !== 'number' || isNaN(currentY) || currentY + effectiveLineHeight > pageHeight - margin - 5) {
                            doc.addPage();
                            currentY = margin;
                            doc.setFont(ROBOTO_FONT_FAMILY_NAME, fontStyleOption);
                            doc.setFontSize(fontSize);
                            doc.setTextColor(color);
                            if (typeof options.onNewPage === 'function') {
                                options.onNewPage();
                            }
                        }
                        let textX = x;
                        if (align === 'center') textX = pageWidth / 2;

                        doc.text(line, textX, currentY, { align: align });
                        currentY += effectiveLineHeight;
                    });

                    if (options.addSpacingAfter && typeof currentY === 'number' && !isNaN(currentY)) {
                        currentY += (options.addSpacingAfter * baseLineHeight);
                    }
                };

                const extractTextFromHTML = (htmlString) => {
                    if (!htmlString) return "";
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = htmlString;
                    Array.from(tempDiv.querySelectorAll('br')).forEach(br => br.replaceWith('\n'));
                    return (tempDiv.textContent || tempDiv.innerText || "").trim();
                };

                addTextWithWrap(project.title, pageWidth / 2, {
                    fontSize: titleFontSize, fontStyle: 'bold', color: titleColor, align: 'center', addSpacingAfter: 0.5
                });

                let metaInfoParts = [];
                if (project.type) metaInfoParts.push(`Tip: ${project.type}`);
                if (project.createdAt) metaInfoParts.push(`Creat la: ${new Date(project.createdAt).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}`);
                if (metaInfoParts.length > 0) {
                    addTextWithWrap(metaInfoParts.join('   |   '), pageWidth / 2, {
                        fontSize: metaFontSize, fontStyle: 'italic', color: metaColor, align: 'center', addSpacingAfter: 1.8
                    });
                } else {
                    currentY += baseLineHeight * 1.8;
                }

                doc.setDrawColor(189, 189, 189);
                doc.setLineWidth(0.25);
                if (typeof currentY === 'number' && !isNaN(currentY)) {
                    doc.line(margin, currentY, pageWidth - margin, currentY);
                    currentY += baseLineHeight * 1.5;
                } else {
                    currentY = margin + 50;
                }

                if (fragmentsToExport.length > 0) {
                    let currentBookRendered = null;
                    let currentChapterRendered = null;
                    const reInitializeHeadersOnNewPage = () => { /* ... la fel ... */ };

                    fragmentsToExport.forEach((fragment, index) => {
                        if (currentY + baseLineHeight * 5 > pageHeight - margin - 5) {
                            doc.addPage(); currentY = margin; reInitializeHeadersOnNewPage();
                        }

                        if (project.type === 'Biblia') {
                            if (fragment.bookName && fragment.bookName !== currentBookRendered) {
                                if (currentBookRendered !== null) currentY += baseLineHeight * 1;
                                currentBookRendered = fragment.bookName;
                                currentChapterRendered = null;
                                addTextWithWrap(currentBookRendered, margin, {
                                    fontSize: bookTitleFontSize, fontStyle: 'bold', color: bookTitleColor, addSpacingAfter: 0.6, onNewPage: reInitializeHeadersOnNewPage
                                });
                            }
                            if (fragment.chapterNumber && String(fragment.chapterNumber) !== currentChapterRendered) {
                                currentChapterRendered = String(fragment.chapterNumber);
                                addTextWithWrap(`Capitolul ${currentChapterRendered}`, margin, {
                                    fontSize: chapterTitleFontSize, fontStyle: 'bold', color: chapterTitleColor, addSpacingAfter: 0.8, onNewPage: reInitializeHeadersOnNewPage
                                });
                            }

                            if (fragment.verseNumber) {
                                const versePrefix = `${fragment.verseNumber}. `;
                                const verseText = extractTextFromHTML(fragment.content) || "(verset gol)";

                                doc.setFont(ROBOTO_FONT_FAMILY_NAME, 'normal');
                                doc.setFontSize(verseNumberFontSize);
                                const prefixWidth = doc.getTextWidth(versePrefix);

                                const yBeforePrefix = currentY;
                                addTextWithWrap(versePrefix, margin + 5, {
                                    fontSize: verseNumberFontSize, fontStyle: 'normal', color: verseNumberColor,
                                });
                                addTextWithWrap(verseText, margin + 5 + prefixWidth + 1, {
                                    _currentYOverride: yBeforePrefix,
                                    fontSize: contentTextFontSize, fontStyle: 'normal', color: contentTextColor, addSpacingAfter: 0.5
                                });
                            } else {
                                const fragmentText = extractTextFromHTML(fragment.content);
                                addTextWithWrap(fragmentText || "(conținut gol)", margin + 5, { addSpacingAfter: 0.5 });
                            }

                        } else {
                            const prefixString = `Fragment ${index + 1}:`;
                            addTextWithWrap(prefixString, margin, {
                                fontSize: fragmentPrefixFontSize, fontStyle: 'bold', color: fragmentPrefixColor, addSpacingAfter: 0.4
                            });
                            const fragmentText = extractTextFromHTML(fragment.content);
                            addTextWithWrap(fragmentText || "(conținut gol)", margin + 7, {
                                fontSize: contentTextFontSize, fontStyle: 'normal', color: contentTextColor, addSpacingAfter: 0.8
                            });
                        }

                        if (typeof currentY === 'number' && !isNaN(currentY)) {
                            if (currentY < pageHeight - margin - 5 && index < fragmentsToExport.length - 1) {
                                doc.setDrawColor(222, 222, 222);
                                doc.setLineWidth(0.15);
                                doc.line(margin, currentY, pageWidth - margin, currentY);
                                currentY += baseLineHeight * 1.2;
                            } else if (index < fragmentsToExport.length - 1) {
                                currentY += baseLineHeight * 1.2;
                            }
                        }
                    });
                } else {
                    addTextWithWrap("Acest proiect nu conține fragmente pentru export.", pageWidth / 2, { /* ... */ });
                }

                const pageCount = doc.internal.getNumberOfPages();
                for (let i = 1; i <= pageCount; i++) {
                    doc.setPage(i);
                    const pageNumText = `Pagina ${i} / ${pageCount}`;
                    doc.setFont(ROBOTO_FONT_FAMILY_NAME, 'normal');
                    doc.setFontSize(metaFontSize - 1);
                    doc.setTextColor(metaColor);
                    doc.text(pageNumText, pageWidth / 2, pageHeight - margin + 7, { align: 'center' });
                }

                const cleanProjectTitle = project.title.replace(/[^\w\s.-]/gi, '').replace(/\s+/g, '_');
                const filename = `${cleanProjectTitle || 'proiect'}_export.pdf`;
                doc.save(filename);

                return { success: true, message: "PDF generat și descărcat cu succes cu jsPDF." };

            } catch (error) {
                console.error("Eroare la exportul PDF (frontend cu jsPDF):", error);
                const errorMessage = error.message || "A apărut o eroare la generarea PDF-ului în browser cu jsPDF.";
                throw new Error(errorMessage);
            } finally {
                this.isExportingPdf = false;
            }
        },

        async exportProjectFragmentsToTXT(projectId) {
            try {
                const currentProjectId = parseInt(projectId);
                const project = this.projects.find(p => p.id === currentProjectId);
                if (!project) {
                    throw new Error("Proiectul nu a fost găsit pentru export.");
                }

                let projectFragmentsGroup = this.fragments.find(group => group.id === currentProjectId);

                const needsBibleFetch = project.type === 'Biblia' && (!projectFragmentsGroup || !projectFragmentsGroup.bibleFragments?.length);
                const needsGenericFetch = project.type !== 'Biblia' && (!projectFragmentsGroup || !projectFragmentsGroup.fragments?.length);

                if (needsBibleFetch) {
                    if (projectFragmentsGroup) {
                        projectFragmentsGroup.bibleFragments = [];
                    } else {
                        projectFragmentsGroup = { id: currentProjectId, bibleFragments: [], fragments: [] };
                        this.fragments.push(projectFragmentsGroup);
                    }

                    await this.fetchProjectBibleBooks(currentProjectId);
                    const booksEntry = this.books.find(b => b.id === currentProjectId);
                    if (!booksEntry || !booksEntry.bibleBooks || booksEntry.bibleBooks.length === 0) {
                        throw new Error(`Nu s-au găsit cărți pentru proiectul biblic ${currentProjectId}.`);
                    }

                    for (const book of booksEntry.bibleBooks) {
                        if (!book.id) continue;
                        await this.fetchProjectBookChapters(currentProjectId, book.id);
                        const chaptersEntry = this.chapters.find(c => c.id === currentProjectId);
                        const currentBookChapters = chaptersEntry?.bibleChapters;
                        if (!currentBookChapters || currentBookChapters.length === 0) continue;

                        for (const chapter of currentBookChapters) {
                            if (!chapter.id) continue;
                            await this.fetchChapterFragments(currentProjectId, chapter.id);
                        }
                    }
                } else if (needsGenericFetch) {
                    await this.fetchProjectFragments(currentProjectId);
                }

                projectFragmentsGroup = this.fragments.find(group => group.id === currentProjectId);

                if (!projectFragmentsGroup ||
                    (project.type === 'Biblia' && (!projectFragmentsGroup.bibleFragments || projectFragmentsGroup.bibleFragments.length === 0)) ||
                    (project.type !== 'Biblia' && (!projectFragmentsGroup.fragments || projectFragmentsGroup.fragments.length === 0))
                ) {
                    throw new Error("Fragmentele proiectului nu au putut fi încărcate pentru export sau sunt goale.");
                }

                const fragmentsToExport = project.type === 'Biblia' ?
                    (projectFragmentsGroup.bibleFragments || []) :
                    (projectFragmentsGroup.fragments || []);

                if (fragmentsToExport.length === 0) {
                    throw new Error("Proiectul nu are fragmente specifice de exportat.");
                }

                let txtContent = "";

                txtContent += project.title + "\n";
                txtContent += "=".repeat(project.title.length) + "\n\n";

                fragmentsToExport.forEach((fragment, index) => {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = fragment.content || "";
                    const textContent = (tempDiv.textContent || tempDiv.innerText || "").trim();

                    let prefix = "";
                    if (project.type === 'Biblia' && fragment.verseNumber != null) {
                        prefix = `${fragment.verseNumber}. `;
                    } else if (project.type !== 'Biblia') {
                    }

                    txtContent += prefix + textContent + "\n\n";
                });

                const fileName = `${project.title.toLowerCase().replace(/\s+/g, '_')}_fragmente.txt`;
                const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });

                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);

                return true;

            } catch (error) {
                console.error("Error exporting project to TXT:", error);
                throw error;
            }
        }
    }
});
