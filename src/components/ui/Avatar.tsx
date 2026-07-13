import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Pencil } from 'lucide-react-native';

interface AvatarProps {
  uri: string;
  size?: number;
  editable?: boolean;
  className?: string;
}

export const Avatar = ({ uri, size = 64, editable, className = '' }: AvatarProps) => {
  return (
    <View style={{ width: size, height: size }} className={className}>
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
      {editable && (
        <TouchableOpacity className="absolute bottom-0 right-0 bg-primary p-1.5 rounded-full border-2 border-white">
          <Pencil size={12} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Avatar;
