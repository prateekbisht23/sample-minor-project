import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  ...props
}) => {
  const getButtonStyles = () => {
    const baseStyles = 'rounded-xl items-center justify-center flex-row';
    
    const sizeStyles = {
      sm: 'px-4 py-2 min-h-[36px]',
      md: 'px-6 py-3 min-h-[48px]',
      lg: 'px-8 py-4 min-h-[56px]',
    };

    const variantStyles = {
      primary: 'bg-primary-500 active:bg-primary-600',
      secondary: 'bg-primary-400 active:bg-primary-500',
      outline: 'border-2 border-primary-500 bg-transparent active:bg-primary-500/10',
      ghost: 'bg-transparent active:bg-dark-700',
      danger: 'bg-error-500 active:bg-error-600',
    };

    const disabledStyles = disabled ? 'opacity-50' : '';

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles}`;
  };

  const getTextStyles = () => {
    const baseStyles = 'font-semibold text-center';
    
    const sizeStyles = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    const variantStyles = {
      primary: 'text-white',
      secondary: 'text-white',
      outline: 'text-primary-400',
      ghost: 'text-primary-400',
      danger: 'text-white',
    };

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`;
  };

  return (
    <TouchableOpacity
      className={getButtonStyles()}
      onPress={onPress}
      disabled={disabled || loading}
      style={style}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? '#a855f7' : '#ffffff'} 
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text className={getTextStyles()} style={textStyle}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
