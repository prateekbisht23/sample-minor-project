import React from 'react';
import { View, Text } from 'react-native';

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  style,
  ...props
}) => {
  const getCardStyles = () => {
    const baseStyles = 'rounded-2xl';
    
    const variantStyles = {
      default: 'bg-dark-800', // Dark card background
      dark: 'bg-dark-800',
      primary: 'bg-primary-500/10 border border-primary-500/20',
      secondary: 'bg-primary-500/5 border border-primary-500/10',
      elevated: 'bg-dark-800 shadow-lg', // For elevated cards
    };

    const paddingStyles = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    };

    return `${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]}`;
  };

  return (
    <View className={getCardStyles()} style={style} {...props}>
      {children}
    </View>
  );
};

export default Card;
