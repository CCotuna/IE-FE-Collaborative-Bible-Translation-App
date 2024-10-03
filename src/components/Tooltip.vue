<template>
    <div class="relative" @mouseup="showTooltip" @touchend="showTooltip" @contextmenu.prevent>
      <slot></slot>
      <div v-if="isTooltipVisible" class="tooltip" :style="tooltipStyle">
        <div class="flex flex-col items-start space-y-2">
          <div class="flex items-center space-x-2">
            <span class="text-black text-xl font-extrabold">AI <i class="bi bi-stars"></i></span>
          </div>
          <div class="flex items-center space-x-2">
            <i class="bi bi-translate text-brand-gold-metallic"></i> <span class="text-black">Traduceri</span>
          </div>
          <div class="flex items-center space-x-2">
            <i class="bi bi-files text-brand-gold-metallic"></i> <span class="text-black">Sinonime</span>
          </div>
          <div class="flex items-center space-x-2">
            <i class="bi bi-bookmark text-brand-gold-metallic"></i> <span class="text-black">Expresii</span>
          </div>
        </div>
        <div class="tooltip-arrow"></div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const isTooltipVisible = ref(false);
  const tooltipStyle = ref({});
  
  const showTooltip = () => {
    const selection = window.getSelection();
    if (selection.toString()) {
      isTooltipVisible.value = true;
      const range = selection.getRangeAt(0).getBoundingClientRect();
      tooltipStyle.value = {
        top: `${range.top + window.scrollY - 210}px`,
        left: `${range.left + window.scrollX - 20}px`
      };
    } else {
      isTooltipVisible.value = false;
    }
  };
  
  const handleClickOutside = (event) => {
    if (!event.target.closest('.tooltip')) {
      isTooltipVisible.value = false;
    }
  };
  
  document.addEventListener('mousedown', handleClickOutside);
  document.addEventListener('touchstart', handleClickOutside);
  
  watch(isTooltipVisible, (newValue) => {
    if (!newValue) {
      tooltipStyle.value = {};
    }
  });
  </script>
  
  <style scoped>
  .tooltip {
    position: absolute;
    background-color: white;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }
  
  .tooltip-arrow {
    position: absolute;
    top: 100%; /* Position the arrow below the tooltip */
    left: 50%; /* Center the arrow */
    margin-left: -10px; /* Adjust this to move arrow left/right */
    border-width: 10px; /* Make the arrow larger */
    border-style: solid;
    border-color: white transparent transparent transparent; /* White arrow pointing up */
  }
  </style>
  