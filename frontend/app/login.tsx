import { View, Text, Pressable, StyleSheet } from 'react-native';
import { login, register } from '@/util/auth';

export default function Login() {
  console.log('Config values:', process.env.API_ROUTE);

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.loginButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={async () => await login('test', '123')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.registerButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={async () => await register('test', '123')}
      >
        <Text style={[styles.buttonText, styles.registerText]}>Register</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loginButton: {
    backgroundColor: '#007AFF',
  },
  registerButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  registerText: {
    color: '#007AFF',
  },
});
