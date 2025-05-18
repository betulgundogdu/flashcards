import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

type IconButtonProps = {
    title: string;
    onPress: () => void;
    icon?: React.ReactNode;
  };

const  IconButton: React.FC<IconButtonProps> = ({ title, onPress, icon }) => (
    <TouchableOpacity onPress={onPress}>
        <Text>{title} {icon}</Text>
    </TouchableOpacity>
);