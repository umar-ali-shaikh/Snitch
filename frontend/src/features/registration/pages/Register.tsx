import { useState } from 'react'
import type { FormEvent } from 'react'

type Role = 'buyer' | 'seller'

interface RegisterForm {
  fullname: string
  email: string
  contact: string
  password: string
  confirmPassword: string
  role: Role
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
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
      >
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
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-offset-0 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-200 dark:border-red-500 dark:focus:ring-red-900/40'
              : 'border-slate-300 focus:border-violet-500 focus:ring-violet-100 dark:border-slate-700 dark:focus:ring-violet-900/40'
          }`}
        />
        {rightSlot}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
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

  const handleRoleChange = (role: Role) => {
    setForm((prev) => ({ ...prev, role }))
  }

  const handleTermsChange = (checked: boolean) => {
    setForm((prev) => ({ ...prev, agreeToTerms: checked }))
    setErrors((prev) => ({ ...prev, agreeToTerms: undefined }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const nextErrors = validate(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/40">
            <svg
              className="h-6 w-6 text-violet-600 dark:text-violet-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Account created
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Welcome to Snitch, {form.fullname.split(' ')[0]}. You can now sign in as a{' '}
            {form.role}.
          </p>
          <button
            type="button"
            onClick={() => {
              setForm(initialForm)
              setSubmitted(false)
            }}
            className="mt-6 w-full rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            Register another account
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-600 via-violet-700 to-slate-900 p-10 text-white lg:flex">
        <div className="text-2xl font-bold tracking-tight">Snitch</div>
        <div>
          <h2 className="max-w-sm text-3xl font-semibold leading-tight">
            Buy and sell with confidence, all in one place.
          </h2>
          <p className="mt-4 max-w-sm text-violet-100">
            Join thousands of buyers and sellers already trading on Snitch.
          </p>
        </div>
        <p className="text-sm text-violet-200">&copy; {new Date().getFullYear()} Snitch. All rights reserved.</p>
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-white/10" />
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-violet-600 hover:underline dark:text-violet-400">
                Sign in
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                I want to
              </span>
              <div className="grid grid-cols-2 gap-3">
                {(['buyer', 'seller'] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleChange(role)}
                    className={`rounded-lg border px-4 py-2.5 text-sm font-medium capitalize transition ${
                      form.role === role
                        ? 'border-violet-600 bg-violet-50 text-violet-700 dark:border-violet-400 dark:bg-violet-900/30 dark:text-violet-300'
                        : 'border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    {role === 'buyer' ? 'Shop' : 'Sell'} as {role}
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
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            />

            <div>
              <label className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={form.agreeToTerms}
                  onChange={(e) => handleTermsChange(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 dark:border-slate-600"
                />
                <span>
                  I agree to Snitch&apos;s{' '}
                  <a href="/terms" className="font-medium text-violet-600 hover:underline dark:text-violet-400">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="font-medium text-violet-600 hover:underline dark:text-violet-400">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                  {errors.agreeToTerms}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2"
            >
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
