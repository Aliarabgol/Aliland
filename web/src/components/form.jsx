export function Field({ label, htmlFor, error, hint, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      {label && <label htmlFor={htmlFor}>{label}</label>}
      {children}
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error" role="alert">{error}</span>}
    </div>
  );
}

export function TextField({ label, id, error, hint, ...props }) {
  return (
    <Field label={label} htmlFor={id} error={error} hint={hint}>
      <input id={id} className="input" aria-invalid={!!error} {...props} />
    </Field>
  );
}

export function TextareaField({ label, id, error, hint, ...props }) {
  return (
    <Field label={label} htmlFor={id} error={error} hint={hint}>
      <textarea id={id} className="input textarea" aria-invalid={!!error} {...props} />
    </Field>
  );
}

export function SelectField({ label, id, error, hint, options = [], placeholder, ...props }) {
  return (
    <Field label={label} htmlFor={id} error={error} hint={hint}>
      <select id={id} className="input select" aria-invalid={!!error} {...props}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const text = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>
    </Field>
  );
}

export function PrivacyCheckbox({ checked, onChange, error }) {
  return (
    <div className={`field checkbox-field ${error ? 'has-error' : ''}`}>
      <label className="checkbox-label">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span>مطالعهٔ <a href="/privacy" target="_blank" rel="noreferrer">حریم خصوصی</a> را تأیید می‌کنم.</span>
      </label>
      {error && <span className="field-error" role="alert">{error}</span>}
    </div>
  );
}

export function FormMessage({ error, success }) {
  if (!error && !success) return null;
  return (
    <div className={`form-message ${error ? 'form-error' : 'form-success'}`} role={error ? 'alert' : 'status'}>
      {error || success}
    </div>
  );
}

export function SubmitButton({ busy, children }) {
  return (
    <button type="submit" className="btn btn-primary" disabled={busy} aria-busy={busy}>
      {busy ? 'در حال ارسال…' : children}
    </button>
  );
}
