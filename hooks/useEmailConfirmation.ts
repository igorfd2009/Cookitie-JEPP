import { useState, useCallback } from 'react';
import { emailService } from '../utils/emailService';
import type { Reservation, Payment } from '../utils/emailService';

export interface EmailConfirmationState {
  isSending: boolean;
  isSent: boolean;
  error: string | null;
  isConfirmed: boolean;
  pickupCode: string | null;
  emailSent: boolean;
}

export function useEmailConfirmation() {
  const [state, setState] = useState<EmailConfirmationState>({
    isSending: false,
    isSent: false,
    error: null,
    isConfirmed: false,
    pickupCode: null,
    emailSent: false
  });

  const sendConfirmationEmail = useCallback(async (reservation: Reservation, payment?: Payment) => {
    setState(prev => ({ ...prev, isSending: true, error: null }));
    
    try {
      await emailService.sendPaymentConfirmationEmail(reservation, payment!);
      setState(prev => ({ ...prev, isSending: false, isSent: true }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar email';
      setState(prev => ({ ...prev, isSending: false, error: errorMessage }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isSending: false,
      isSent: false,
      error: null,
      isConfirmed: false,
      pickupCode: null,
      emailSent: false
    });
  }, []);

  const sendThankYouEmail = useCallback(async (reservation: Reservation) => {
    setState(prev => ({ ...prev, isSending: true, error: null }));
    try {
      await emailService.sendThankYouEmail(reservation);
      setState(prev => ({ ...prev, isSending: false, emailSent: true }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar email';
      setState(prev => ({ ...prev, isSending: false, error: errorMessage }));
    }
  }, []);

  const sendPaymentConfirmation = useCallback(async (reservation: Reservation, payment: Payment) => {
    setState(prev => ({ ...prev, isSending: true, error: null }));
    try {
      await emailService.sendPaymentConfirmationEmail(reservation, payment);
      setState(prev => ({ ...prev, isSending: false, isConfirmed: true }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar email';
      setState(prev => ({ ...prev, isSending: false, error: errorMessage }));
    }
  }, []);

  const sendReminderEmail = useCallback(async (reservation: Reservation) => {
    setState(prev => ({ ...prev, isSending: true, error: null }));
    try {
      await emailService.sendReminderEmail(reservation);
      setState(prev => ({ ...prev, isSending: false, emailSent: true }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar email';
      setState(prev => ({ ...prev, isSending: false, error: errorMessage }));
    }
  }, []);

  const resetState = useCallback(() => {
    setState({
      isSending: false,
      isSent: false,
      error: null,
      isConfirmed: false,
      pickupCode: null,
      emailSent: false
    });
  }, []);

  return {
    ...state,
    sendConfirmationEmail,
    sendThankYouEmail,
    sendPaymentConfirmation,
    sendReminderEmail,
    reset,
    resetState
  };
}
