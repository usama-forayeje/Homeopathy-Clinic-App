'use client';

import React, { useEffect, useRef } from 'react';
import { useVoiceTyping } from '@/hooks/useVoiceTyping'; 
import { Mic, MicOff, RotateCcw, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const VoiceInputBn = React.forwardRef( 
  (
    {
      value,
      onChange,
      onBlur,
      name,
      component: InputComponent,
      className,
      ...props
    },
    ref
  ) => {
    const {
      isListening,
      transcript,
      error,
      startListening,
      stopListening,
      resetTranscript,
      setTranscript,
      browserSupportsSpeechRecognition,
    } = useVoiceTyping({ continuous: false, interimResults: false, lang: 'bn-BD' }); 

    const internalValue = (value === null ? '' : value) ?? transcript;

    useEffect(() => {
      if (isListening && transcript && onChange) {
        onChange({ target: { value: transcript } });
      }
    }, [transcript, onChange, isListening]);

    const handleMicClick = () => {
      if (isListening) {
        stopListening();
      } else {
        setTranscript(internalValue || '');
        startListening();
      }
    };

    const handleClearClick = () => {
      if (onChange) {
        onChange({ target: { value: '' } });
      } else {
        resetTranscript();
      }
    };

    if (!browserSupportsSpeechRecognition) {
      return (
        <div className="flex items-center space-x-2">
          <InputComponent
            ref={ref}
            name={name}
            value={value === null ? '' : value}
            onChange={onChange}
            onBlur={onBlur}
            className={className}
            {...props}
          />
          <span className="text-sm text-red-500">ভয়েস টাইপিং সমর্থিত নয়</span> 
        </div>
      );
    }

    return (
      <div className="relative flex items-center">
        <InputComponent
          ref={ref}
          name={name}
          value={internalValue}
          onChange={onChange}
          onBlur={onBlur}
          className={cn(
            'pr-10',
            className
          )}
          {...props}
        />
        <div className="absolute right-2 flex items-center space-x-1">
          {isListening ? (
            <MicOff
              className="h-4 w-4 cursor-pointer text-red-500 animate-pulse"
              onClick={handleMicClick}
            />
          ) : (
            <Mic
              className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={handleMicClick}
            />
          )}
          {(typeof internalValue === 'string' && internalValue.length > 0) && (
            <XCircle
              className="h-4 w-4 cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={handleClearClick}
            />
          )}
        </div>
        {error && <p className="absolute -bottom-5 left-0 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

VoiceInputBn.displayName = 'VoiceInputBn'; 