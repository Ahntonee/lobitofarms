import RichTextEditor from './RichTextEditor';
import ImagePicker from './ImagePicker';

export default function FieldInput({ field, value, onChange }) {
  const id = `field-${field.name}`;

  switch (field.type) {
    case 'richtext':
      return (
        <div className="mb-3">
          <label className="form-label">{field.label}</label>
          <RichTextEditor value={value || ''} onChange={onChange} />
        </div>
      );
    case 'textarea':
      return (
        <div className="mb-3">
          <label className="form-label" htmlFor={id}>{field.label}</label>
          <textarea id={id} className="form-control" rows={3} value={value || ''} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
    case 'images':
      return (
        <ImagePicker
          label={field.label}
          value={value || []}
          single={field.single}
          onChange={onChange}
        />
      );
    case 'tags':
      return (
        <div className="mb-3">
          <label className="form-label" htmlFor={id}>{field.label}</label>
          <input
            id={id}
            className="form-control"
            value={(value || []).join(', ')}
            onChange={(e) => onChange(e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
          />
        </div>
      );
    case 'number':
      return (
        <div className="mb-3">
          <label className="form-label" htmlFor={id}>{field.label}</label>
          <input id={id} type="number" className="form-control" value={value ?? ''} onChange={(e) => onChange(Number(e.target.value))} />
        </div>
      );
    case 'datetime':
      return (
        <div className="mb-3">
          <label className="form-label" htmlFor={id}>{field.label}</label>
          <input
            id={id}
            type="datetime-local"
            className="form-control"
            value={value ? new Date(value).toISOString().slice(0, 16) : ''}
            onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
          />
        </div>
      );
    case 'text':
    default:
      return (
        <div className="mb-3">
          <label className="form-label" htmlFor={id}>
            {field.label} {field.required && <span className="text-danger">*</span>}
          </label>
          <input
            id={id}
            className="form-control"
            required={field.required}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
  }
}
