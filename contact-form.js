(() => {
  const form = document.querySelector('#inquiry-form');
  const service = form.querySelector('#service');
  const requested = new URLSearchParams(location.search).get('service');
  const value = requested === 'sales' ? 'store-consulting' : requested;
  if (value && Array.from(service.options).some(option => option.value === value)) {
    service.value = value;
  }

  form.addEventListener('submit', event => {
    for (const field of form.querySelectorAll('input[required]:not([type=checkbox]), textarea[required]')) {
      if (!field.value.trim()) {
        field.setCustomValidity('入力してください');
        event.preventDefault();
        field.reportValidity();
        return;
      }
      field.setCustomValidity('');
    }
    let label = form.querySelector('input[name="サービス名"]');
    if (!label) {
      label = document.createElement('input');
      label.type = 'hidden';
      label.name = 'サービス名';
      form.append(label);
    }
    label.value = service.selectedOptions[0].textContent;
  });
  form.addEventListener('input', event => {
    if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
  });
})();
