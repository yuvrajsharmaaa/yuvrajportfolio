import emailjs from '@emailjs/browser';

interface EmailFormData {
  name: string;
  email: string;
  message: string;
  title?: string;
}

interface EmailJSError {
  text: string;
  status: number;
}

// EmailJS Configuration
const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_gykj7wr',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_upwg0p7',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '5PmF525aKrV96l7Yk'
};

// Verify EmailJS configuration
const verifyEmailJSConfig = () => {
  console.log('Verifying EmailJS config:', {
    hasServiceId: !!EMAILJS_CONFIG.serviceId,
    hasTemplateId: !!EMAILJS_CONFIG.templateId,
    hasPublicKey: !!EMAILJS_CONFIG.publicKey,
    serviceId: EMAILJS_CONFIG.serviceId,
    templateId: EMAILJS_CONFIG.templateId,
    publicKey: EMAILJS_CONFIG.publicKey ? '5PmF525aKrV96l7Yk' : undefined
  });

  if (!EMAILJS_CONFIG.serviceId || !EMAILJS_CONFIG.templateId || !EMAILJS_CONFIG.publicKey) {
    throw new Error('EmailJS configuration is incomplete. Please check your environment variables.');
  }
  return true;
};

// Test function to verify email functionality
export const testEmailFunctionality = async () => {
  const testData: EmailFormData = {
    name: 'Test User',
    email: 'test@example.com',
    message: 'This is a test email to verify EmailJS functionality.'
  };

  console.log('Starting email test with configuration:', {
    serviceId: EMAILJS_CONFIG.serviceId,
    templateId: EMAILJS_CONFIG.templateId,
    publicKey: EMAILJS_CONFIG.publicKey ? '***' : undefined
  });
  
  try {
    const result = await sendEmail(testData);
    console.log('Test result:', result);
    return result;
  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  }
};

export const sendEmail = async (formData: EmailFormData) => {
  try {
    console.log('Starting sendEmail function');
    verifyEmailJSConfig();

    if (!formData.name || !formData.email || !formData.message) {
      console.error('Missing form data:', { 
        hasName: !!formData.name, 
        hasEmail: !!formData.email, 
        hasMessage: !!formData.message 
      });
      return {
        success: false,
        error: new Error('Missing required fields: name, email, or message')
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.error('Invalid email format:', formData.email);
      return {
        success: false,
        error: new Error('Invalid email format')
      };
    }

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      name: formData.name,
      message: formData.message,
      title: formData.title || 'Contact Form',
      time: new Date().toLocaleString(),
      to_name: 'Yuvraj',
      reply_to: formData.email,
    };

    console.log('Preparing to send email with params:', {
      ...templateParams,
      from_email: '***@***' // Hide email in logs
    });

    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      throw new Error('EmailJS can only be used in browser environment');
    }

    // Initialize EmailJS with error handling
    try {
      emailjs.init(EMAILJS_CONFIG.publicKey);
    } catch (initError) {
      console.error('Failed to initialize EmailJS:', initError);
      return {
        success: false,
        error: new Error('Failed to initialize email service')
      };
    }

    console.log('Sending email with config:', {
      serviceId: EMAILJS_CONFIG.serviceId,
      templateId: EMAILJS_CONFIG.templateId
    });

    try {
      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );

      console.log('Raw EmailJS response:', result);

      if (!result) {
        throw new Error('No response received from email service');
      }

      if (result.status !== 200) {
        throw new Error(result.text || 'Failed to send email');
      }

      console.log('Email sent successfully:', result.text);
      return { success: true, data: result };
    } catch (emailError) {
      // Handle specific EmailJS errors
      if (emailError instanceof Error) {
        console.error('EmailJS error details:', {
          message: emailError.message,
          name: emailError.name,
          stack: emailError.stack
        });

        // Check for common EmailJS errors
        if (emailError.message.includes('Invalid template')) {
          return {
            success: false,
            error: new Error('Email template configuration is invalid')
          };
        }
        if (emailError.message.includes('Invalid service')) {
          return {
            success: false,
            error: new Error('Email service configuration is invalid')
          };
        }
        if (emailError.message.includes('Invalid public key')) {
          return {
            success: false,
            error: new Error('Email service authentication failed')
          };
        }

        return {
          success: false,
          error: new Error(`Failed to send email: ${emailError.message}`)
        };
      }

      // Handle unknown errors with more detail
      console.error('Unknown error in email sending:', {
        error: emailError,
        type: typeof emailError,
        stringified: JSON.stringify(emailError, null, 2)
      });
      
      return {
        success: false,
        error: new Error(
          `An unexpected error occurred: ` +
          (emailError instanceof Error
            ? emailError.message
            : JSON.stringify(emailError, null, 2))
        )
      };
    }
  } catch (error) {
    console.error('Unexpected error in sendEmail:', {
      error,
      type: typeof error,
      stringified: JSON.stringify(error, null, 2)
    });
    
    return {
      success: false,
      error: error instanceof Error 
        ? error 
        : new Error(
            `Failed to send message: ` +
            (typeof error === 'object' ? JSON.stringify(error, null, 2) : String(error))
          )
    };
  }
}; 