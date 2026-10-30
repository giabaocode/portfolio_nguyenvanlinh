(() => {
  const dialog = document.querySelector('#desk-dialog');
  const title = document.querySelector('#desk-dialog-title');
  const body = document.querySelector('#desk-dialog-body');
  const illustration = document.querySelector('#desk-dialog-art');
  const content = {
    notes: {
      title: 'Trong cuốn sổ của mình',
      body: 'Một chỗ dành cho những điều Linh đang tìm hiểu: ghi chú về công việc, một chủ đề kinh tế hoặc vài dòng sau khi đọc một cuốn sách.',
      note: 'Góc ghi chú đang chờ nội dung thật từ Linh.',
    },
    photo: {
      title: 'Một chút ngoài công việc',
      body: 'Góc nhỏ dành cho hình ảnh, sở thích và những câu chuyện cá nhân của Linh.',
      note: 'Hình trên trang là minh họa. Ảnh và câu chuyện cá nhân sẽ được bổ sung sau.',
    },
  };
  document.querySelectorAll('[data-desk]').forEach(button => {
    button.addEventListener('click', () => {
      const key = button.dataset.desk;
      if (key === 'contact') { openDialog(document.querySelector('#contact-dialog')); return; }
      const entry = content[key];
      if (!entry) return;
      title.textContent = entry.title;
      body.textContent = entry.body;
      document.querySelector('#desk-dialog-note').textContent = entry.note;
      illustration.hidden = key !== 'photo';
      openDialog(dialog);
    });
  });
  const section = document.querySelector('.desk-section');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        section.classList.add('is-seen');
        observer.disconnect();
      }
    }, { threshold: .12 });
    observer.observe(section);
  }
})();
