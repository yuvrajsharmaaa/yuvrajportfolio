'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { sendEmail } from '@/app/lib/email'

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')
    
    try {
      console.log('Submitting form with data:', {
        ...formData,
        email: '***@***' // Hide email in logs
      });

      const result = await sendEmail(formData)
      
      if (result.success) {
        console.log('Email sent successfully');
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        console.error('Email sending failed:', result.error);
        setStatus('error')
        setErrorMessage(result.error?.message || 'Failed to send message')
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message')
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
      <div className="relative">
        <h2 className="text-2xl font-bold mb-6 text-center">Contact Me</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {status === 'error' && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="font-medium">Error sending message:</p>
              <p className="text-sm">{errorMessage}</p>
              <p className="text-xs mt-2">Please check your internet connection and try again.</p>
            </div>
          )}
          {status === 'success' && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              <p className="font-medium">Success!</p>
              <p className="text-sm">Your message has been sent successfully.</p>
            </div>
          )}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  )
} 