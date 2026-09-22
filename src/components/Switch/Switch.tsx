import './Switch.css'

interface SwitchProps {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export function Switch({ id, checked, onChange, label }: SwitchProps) {
  return (
    <label className="switch" htmlFor={id}>
      <span className="switch__label">{label}</span>
      <span className="switch__track" data-checked={checked}>
        <input
          id={id}
          type="checkbox"
          role="switch"
          aria-checked={checked}
          className="switch__input"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className="switch__thumb" />
      </span>
    </label>
  )
}
