import { useState } from 'react'
import type { SubmitEvent } from 'react'
import type { UserRole } from '../../state/auth.slice'

interface RegisterForm {
  fullname: string
  email: string
  contact: string
  password: string
  confirmPassword: string
  role: UserRole
  agreeToTerms: boolean
}

type FormErrors = Partial<Record<keyof RegisterForm, string>>

const initialForm: RegisterForm = {
  fullname: '',
  email: '',
  contact: '',
  password: '',
  confirmPassword: '',
  role: 'buyer',
  agreeToTerms: false,
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CONTACT_PATTERN = /^\+?[0-9]{7,15}$/

function validate(form: RegisterForm): FormErrors {
  const errors: FormErrors = {}

  if (!form.fullname.trim()) {
    errors.fullname = 'Full name is required'
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required'
  } else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = 'Enter a valid email address'
  }

  if (!form.contact.trim()) {
    errors.contact = 'Contact number is required'
  } else if (!CONTACT_PATTERN.test(form.contact.trim())) {
    errors.contact = 'Enter a valid contact number'
  }

  if (!form.password) {
    errors.password = 'Password is required'
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Confirm your password'
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Passwords do not match'
  }

  if (!form.agreeToTerms) {
    errors.agreeToTerms = 'You must accept the terms to continue'
  }

  return errors
}

const goldButton =
  'w-full rounded-lg bg-gold-600 px-4 py-3 text-sm font-medium tracking-wide text-ivory shadow-[0_6px_20px_-8px_rgba(140,106,34,0.6)] transition hover:bg-gold-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream active:translate-y-px'

const goldLink =
  'font-medium text-gold-600 underline-offset-4 hover:text-gold-700 hover:underline'

interface FieldProps {
  label: string
  name: keyof RegisterForm
  type?: string
  placeholder?: string
  value: string
  error?: string
  autoComplete?: string
  onChange: (name: keyof RegisterForm, value: string) => void
  rightSlot?: React.ReactNode
}

function Field({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  error,
  autoComplete,
  onChange,
  rightSlot,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(name, e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`w-full rounded-lg border bg-ivory px-3.5 py-2.5 text-ink outline-none transition placeholder:text-ink-faint focus:ring-4 ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
              : 'border-sand hover:border-gold-300 focus:border-gold-500 focus:ring-gold-100'
          } ${rightSlot ? 'pr-11' : ''}`}
        />
        {rightSlot}
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

function Brand({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-400 font-display text-lg font-semibold text-gold-600">
        S
      </span>
      <span className="font-display text-2xl font-semibold tracking-[0.18em] text-ink">
        SNITCH
      </span>
    </div>
  )
}

function Register() {
  const [form, setForm] = useState<RegisterForm>(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)


  const handleChange = (name: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleRoleChange = (role: UserRole) => {
    setForm((prev) => ({ ...prev, role }))
  }

  const handleTermsChange = (checked: boolean) => {
    setForm((prev) => ({ ...prev, agreeToTerms: checked }))
    setErrors((prev) => ({ ...prev, agreeToTerms: undefined }))
  }

  // Validates locally only — not connected to the backend yet
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <div className="w-full max-w-md rounded-2xl border border-sand bg-ivory p-10 text-center shadow-[0_20px_50px_-24px_rgba(115,86,25,0.35)]">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-gold-300 bg-gold-100">
            <svg
              className="h-6 w-6 text-gold-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-semibold text-ink">Account created</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Welcome to Snitch, {form.fullname.split(' ')[0]}.{' '}
            {form.role === 'seller'
              ? 'Your seller account is ready — start listing your products.'
              : 'Your account is ready — start exploring the collection.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setForm(initialForm)
              setSubmitted(false)
            }}
            className={`mt-8 ${goldButton}`}
          >
            Register another account
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-sand bg-gradient-to-br from-champagne via-gold-100 to-gold-200 p-12 lg:flex">
        <Brand />

        <div className="relative z-10">
          <span className="mb-5 block h-px w-16 bg-gold-500" />
          <h2 className="max-w-md font-display text-5xl font-semibold leading-[1.08] text-ink">
            Style that speaks before you do.
          </h2>
          <p className="mt-5 max-w-sm leading-relaxed text-ink-muted">
            Shop the latest collection, or open your own store and sell to customers across
            the country.
          </p>
        </div>

        <p className="relative z-10 text-sm text-ink-muted">
          &copy; {new Date().getFullYear()} Snitch. All rights reserved.
        </p>

        {/* Decorative gold rings */}
        <div className="pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full border border-gold-400/50" />
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full border border-gold-400/30" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-gold-300/25 blur-2xl" />
      </div>

      {/* Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <Brand className="mb-10 justify-center lg:hidden" />

          <div className="mb-8 text-center lg:text-left">
            <h1 className="font-display text-4xl font-semibold text-ink">Create your account</h1>
            <p className="mt-2 text-sm text-ink-muted">
              Already have an account?{' '}
              <a href="/login" className={goldLink}>
                Sign in
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-ink">I want to</span>
              <div className="grid grid-cols-2 gap-1 rounded-xl border border-sand bg-champagne/60 p-1">
                {(['buyer', 'seller'] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleChange(role)}
                    aria-pressed={form.role === role}
                    className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                      form.role === role
                        ? 'bg-ivory text-gold-700 shadow-sm ring-1 ring-gold-300'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {role === 'buyer' ? 'Shop as buyer' : 'Sell as seller'}
                  </button>
                ))}
              </div>
            </div>

            <Field
              label="Full name"
              name="fullname"
              placeholder="Jordan Smith"
              value={form.fullname}
              error={errors.fullname}
              autoComplete="name"
              onChange={handleChange}
            />

            <Field
              label="Email address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              error={errors.email}
              autoComplete="email"
              onChange={handleChange}
            />

            <Field
              label="Contact number"
              name="contact"
              type="tel"
              placeholder="+1 555 123 4567"
              value={form.contact}
              error={errors.contact}
              autoComplete="tel"
              onChange={handleChange}
            />

            <Field
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 8 characters"
              value={form.password}
              error={errors.password}
              autoComplete="new-password"
              onChange={handleChange}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-faint transition hover:text-gold-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            />

            <Field
              label="Confirm password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              error={errors.confirmPassword}
              autoComplete="new-password"
              onChange={handleChange}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-faint transition hover:text-gold-600"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            />

            <div>
              <label className="flex items-start gap-2.5 text-sm text-ink-muted">
                <input
                  type="checkbox"
                  checked={form.agreeToTerms}
                  onChange={(e) => handleTermsChange(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-sand accent-gold-600"
                />
                <span>
                  I agree to Snitch&apos;s{' '}
                  <a href="/terms" className={goldLink}>
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className={goldLink}>
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="mt-1.5 text-sm text-red-700">{errors.agreeToTerms}</p>
              )}
            </div>

            <button type="submit" className={goldButton}>
              Create account
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function EyeIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  )
}

export default Register
