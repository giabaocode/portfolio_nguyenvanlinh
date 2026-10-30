const projects = {
  macro: { label: 'DỰ ÁN MẪU 01 / PHÂN TÍCH VĨ MÔ', title: 'Theo dõi kinh tế vĩ mô', description: 'Ví dụ về một bài phân tích các chỉ báo kinh tế theo thời gian.', question: 'Những chỉ báo nào giúp giải thích sự thay đổi của nền kinh tế?', approach: 'Xác định câu hỏi, chọn nguồn dữ liệu công khai, kiểm tra dữ liệu và trực quan hóa xu hướng.', deliverable: 'Một báo cáo ngắn và bộ biểu đồ đi kèm. Nguồn dữ liệu, vai trò và kết quả thực tế sẽ được bổ sung từ hồ sơ của Linh.' },
  consumer: { label: 'DỰ ÁN MẪU 02 / NGHIÊN CỨU THỊ TRƯỜNG', title: 'Tìm hiểu người tiêu dùng', description: 'Ví dụ về một nghiên cứu nhu cầu và thói quen mua sắm.', question: 'Điều gì tác động đến cách người tiêu dùng lựa chọn?', approach: 'Xây dựng câu hỏi nghiên cứu, phân nhóm quan sát và chuyển kết quả thành những góc nhìn dễ tiếp cận.', deliverable: 'Bản tổng hợp nghiên cứu cùng các đề xuất. Phương pháp, mẫu nghiên cứu và kết quả sẽ được cập nhật theo dự án thật.' },
  finance: { label: 'DỰ ÁN MẪU 03 / TÀI CHÍNH & DỮ LIỆU', title: 'Phân tích tài chính', description: 'Ví dụ về một bài phân tích báo cáo tài chính có biểu đồ đi kèm.', question: 'Làm thế nào để biến những bảng số liệu thành thông tin hữu ích?', approach: 'Tổ chức dữ liệu, xác định chỉ số phù hợp và trình bày các mối liên hệ qua biểu đồ.', deliverable: 'Một dashboard hoặc bản phân tích có chú thích. Các chỉ số trên trang hiện tại hoàn toàn là minh họa bố cục.' }
};
function syncDialogState() { document.body.classList.toggle('modal-open', Boolean(document.querySelector('dialog[open]'))); }
function openDialog(dialog) { dialog.showModal(); syncDialogState(); }
function closeDialog(dialog) { dialog.close(); syncDialogState(); }
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  document.querySelector('#dialog-label').textContent = project.label;
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-description').textContent = project.description;
  const details = document.querySelector('#dialog-details'); details.replaceChildren();
  [['Câu hỏi đặt ra', project.question], ['Cách tiếp cận', project.approach], ['Đầu ra dự kiến', project.deliverable]].forEach(([title, body]) => {
    const heading = document.createElement('h3'); heading.textContent = title;
    const paragraph = document.createElement('p'); paragraph.textContent = body;
    details.append(heading, paragraph);
  });
  openDialog(document.querySelector('#project-dialog'));
}));
document.querySelector('#contact-button').addEventListener('click', () => openDialog(document.querySelector('#contact-dialog')));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelectorAll('.dialog-close,.dialog-done').forEach(button => button.addEventListener('click', () => closeDialog(dialog)));
  dialog.addEventListener('close', syncDialogState);
  dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeDialog(dialog); } });
});
const navigation = [...document.querySelectorAll('nav a')];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) navigation.forEach(link => link.classList.toggle('active', link.hash === '#' + entry.target.id)); });
}, { rootMargin: '-20% 0px -50% 0px', threshold: 0 });
document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
