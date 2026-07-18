/**
 * 将Canvas导出为图片并下载
 * 兼容处理移动端大图导出问题
 * @param {HTMLCanvasElement} canvas - canvas元素
 * @param {string} filename - 文件名
 */
export const downloadCanvasAsImage = (canvas, filename) => {
  try {
    // 优先尝试使用 toBlob，因为它处理大文件更有效率且不容易崩溃
    if (canvas.toBlob) {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas转换Blob失败');
          fallbackToDataURL(canvas, filename);
          return;
        }
        
        // 尝试使用 navigator.share (主要针对移动端)
        // 注意：navigator.share 需要在 HTTPS 环境下，且必须由用户手势触发
        // 这里作为一种尝试，如果失败则回退到下载链接
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], filename, { type: blob.type })] })) {
            const file = new File([blob], filename, { type: blob.type });
            navigator.share({
                files: [file],
                title: '分享图片',
                text: filename
            }).catch((err) => {
                console.log('分享失败，尝试下载:', err);
                downloadBlob(blob, filename);
            });
        } else {
            downloadBlob(blob, filename);
        }
      }, 'image/png');
    } else {
      fallbackToDataURL(canvas, filename);
    }
  } catch (e) {
    console.error('导出图片出错:', e);
    fallbackToDataURL(canvas, filename);
  }
};

/**
 * 图片导出时强制使用桌面表格布局（隐藏手机卡片）。
 * 表格导出（文本/剪贴板）不走这里。
 * @param {HTMLElement | null | undefined} rootEl
 * @param {() => Promise<T>} fn
 * @returns {Promise<T>}
 * @template T
 */
export async function withDesktopExportLayout(rootEl, fn) {
  if (!rootEl) {
    return await fn();
  }

  const className = "is-exporting-image";
  rootEl.classList.add(className);
  document.documentElement.classList.add(className);

  const backups = [];
  const remember = (el) => {
    backups.push({
      el,
      display: el.style.display,
      minWidth: el.style.minWidth,
      width: el.style.width,
      overflow: el.style.overflow,
      height: el.style.height,
      maxHeight: el.style.maxHeight,
    });
  };

  rootEl.querySelectorAll(".table-desktop").forEach((el) => {
    remember(el);
    el.style.display = "block";
    el.style.minWidth = el.style.minWidth || "1100px";
    el.style.overflow = "visible";
    el.style.height = "auto";
    el.style.maxHeight = "none";
  });

  rootEl.querySelectorAll(".mobile-card-list").forEach((el) => {
    remember(el);
    el.style.display = "none";
  });

  // 展开可能被限制高度的滚动区
  rootEl.querySelectorAll(".n-data-table-base-table-body, .table-container, .table-content").forEach((el) => {
    remember(el);
    el.style.height = "auto";
    el.style.maxHeight = "none";
    el.style.overflow = "visible";
  });

  try {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return await fn();
  } finally {
    backups.forEach(({ el, display, minWidth, width, overflow, height, maxHeight }) => {
      el.style.display = display;
      el.style.minWidth = minWidth;
      el.style.width = width;
      el.style.overflow = overflow;
      el.style.height = height;
      el.style.maxHeight = maxHeight;
    });
    rootEl.classList.remove(className);
    document.documentElement.classList.remove(className);
  }
}

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // 兼容某些移动端浏览器，添加到body
  document.body.appendChild(link);
  
  try {
      link.click();
  } catch (e) {
      console.error("Link click failed", e);
  }
  
  // 清理
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

const fallbackToDataURL = (canvas, filename) => {
  try {
    const imgUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    console.error('DataURL导出失败:', e);
    alert('导出图片失败，图片可能过大');
  }
};
