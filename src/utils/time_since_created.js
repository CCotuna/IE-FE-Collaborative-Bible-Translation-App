export const timeSinceCreated = (date) => {
    console.log(date);
    const diffInMs = new Date() - new Date(date);
    const diffInSec = diffInMs / 1000;
    const diffInMin = diffInSec / 60;
    const diffInHours = diffInMin / 60;
    const diffInDays = diffInHours / 24;
    const diffInMonths = diffInDays / 30.44;
    const diffInYears = diffInMonths / 12;

    if (diffInYears >= 1) {
        return `${Math.floor(diffInYears)}y ago`;
    } else if (diffInMonths >= 1) {
        return `${Math.floor(diffInMonths)}mo ago`;
    } else if (diffInDays >= 1) {
        return `${Math.floor(diffInDays)}d ago`;
    } else if (diffInHours >= 1) {
        return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInMin >= 1) {
        return `${Math.floor(diffInMin)}m ago`;
    } else {
        return `${Math.floor(diffInSec)}s ago`;
    }
};