import { useRef, useState } from 'react';
import { api } from '../api.js';

export function useLeadSubmit(type) {
  const idemKey = useRef(
    typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `idem-${Date.now()}-${Math.random()}`,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [fields, setFields] = useState(null);
  const [result, setResult] = useState(null);

  const submit = async (payload) => {
    setBusy(true);
    setError('');
    setFields(null);
    try {
      const res = await api.post(`/leads/${type}`, payload, { 'Idempotency-Key': idemKey.current });
      setResult(res);
      return res;
    } catch (err) {
      setError(err.message);
      setFields(err.fields || null);
      return null;
    } finally {
      setBusy(false);
    }
  };

  return { submit, busy, error, fields, result, setResult };
}
