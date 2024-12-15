import React from 'react';
import './Modal.css';
import Button from '../Button/Button';


interface ModalProps {
  show: boolean;
  onClose: () => void;
  onSave?: (inputValue: string) => void;
  title: string;
  message?: string;
  inputPlaceholder?: string;
  inputVisible?: boolean;
  notification?: boolean;
  children?: React.ReactNode;
  textNo?: string;
  textYes?: string;
}


const Modal: React.FC<ModalProps> = ({
  show,
  onClose,
  onSave,
  title,
  message,
  inputPlaceholder,
  inputVisible = true,
  notification = false,
  children,
  textNo = 'Отмена',
  textYes = 'Сохранить'
}) => {
  const [inputValue, setInputValue] = React.useState('');


  const handleSave = () => {
    if (onSave) {
      onSave(inputValue || '');
    }
    setInputValue('');
    onClose();
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{title}</h2>
        {message && <p>{message}</p>}
        {inputVisible && !notification && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={inputPlaceholder}
          />
        )}
        {children}
        <div className="modal__buttons">
          {notification ? (
            <Button type="accent" onClick={onClose}>OK</Button>
          ) : (
            <>
              <Button type="regular" onClick={onClose}>{textNo}</Button>
              <Button type="accent" onClick={handleSave}>{textYes}</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
