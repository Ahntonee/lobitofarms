import { useState, useCallback } from 'react';
import ConfirmModal from '../components/ui/ConfirmModal';

export default function useConfirm() {
  const [state, setState] = useState(null);

  const confirm = useCallback((options) => {
    const opts = typeof options === 'string' ? { message: options } : options;
    return new Promise((resolve) => {
      setState({ ...opts, resolve });
    });
  }, []);

  function handleOk() {
    state.resolve(true);
    setState(null);
  }

  function handleCancel() {
    state.resolve(false);
    setState(null);
  }

  const ConfirmDialog = state ? (
    <ConfirmModal
      title={state.title}
      message={state.message}
      confirmLabel={state.confirmLabel}
      destructive={state.destructive}
      onOk={handleOk}
      onCancel={handleCancel}
    />
  ) : null;

  return { confirm, ConfirmDialog };
}
