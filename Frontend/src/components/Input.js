import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  error,
  disabled = false,
  rightIcon,
  onRightIconPress,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyles = () => {
    const baseStyles = 'border-2 rounded-xl px-4 py-3 min-h-[48px]';
    
    const stateStyles = isFocused 
      ? 'border-primary-500 bg-primary-500/10' 
      : 'border-dark-600 bg-dark-700';
    
    const errorStyles = error ? 'border-error-500 bg-error-500/10' : '';
    const disabledStyles = disabled ? 'opacity-50 bg-dark-800' : '';

    return `${baseStyles} ${stateStyles} ${errorStyles} ${disabledStyles}`;
  };

  const getTextStyles = () => {
    const baseStyles = 'text-base text-text-primary';
    const errorStyles = error ? 'text-error-400' : '';
    
    return `${baseStyles} ${errorStyles}`;
  };

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-text-secondary mb-2">
          {label}
        </Text>
      )}
      
      <View className="relative">
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#64748b"
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
          className={`${getContainerStyles()} ${multiline ? 'text-top min-h-[100px]' : ''} ${getTextStyles()}`}
          {...props}
        />
        
        {rightIcon && (
          <TouchableOpacity
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onPress={onRightIconPress}
            disabled={disabled}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text className="text-sm text-error-400 mt-1">
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;
