import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { LoginRequest } from '../types/models';

const LoginScreen = () => {
  const { login, loginLoading } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginRequest>>({});

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Partial<LoginRequest> = {};

    if (!formData.username.trim()) {
      newErrors.username = '请输入用户名';
    } else if (formData.username.length < 4 || formData.username.length > 16) {
      newErrors.username = '用户名长度为4-16位';
    } else if (!/^[A-Za-z0-9]+$/.test(formData.username)) {
      newErrors.username = '用户名只能包含字母和数字';
    }

    if (!formData.password.trim()) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 4 || formData.password.length > 16) {
      newErrors.password = '密码长度为4-16位';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理登录
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      // 登录成功后，导航会自动切换到主界面
    } catch (error: any) {
      console.error('登录错误:', error);
      
      // 处理不同类型的错误
      let errorMessage = '登录失败，请稍后重试';
      
      if (error.response?.status === 401) {
        errorMessage = '用户名或密码错误';
      } else if (error.response?.status === 403) {
        errorMessage = '账户已被禁用';
      } else if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('登录失败', errorMessage);
    }
  };

  // 更新表单数据
  const updateFormData = (field: keyof LoginRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* 标题区域 */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>欢迎回来</Text>
            <Text style={styles.subtitle}>请登录您的账户</Text>
          </View>

          {/* 表单区域 */}
          <View style={styles.formContainer}>
            {/* 用户名输入 */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>用户名</Text>
              <View style={[styles.inputWrapper, errors.username && styles.inputError]}>
                <Feather name="user" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="请输入用户名"
                  value={formData.username}
                  onChangeText={(text) => updateFormData('username', text)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loginLoading}
                />
              </View>
              {errors.username && (
                <Text style={styles.errorText}>{errors.username}</Text>
              )}
            </View>

            {/* 密码输入 */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>密码</Text>
              <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                <Feather name="lock" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="请输入密码"
                  value={formData.password}
                  onChangeText={(text) => updateFormData('password', text)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loginLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                  disabled={loginLoading}
                >
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* 登录按钮 */}
            <TouchableOpacity
              style={[styles.loginButton, loginLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loginLoading}
            >
              {loginLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>登录</Text>
              )}
            </TouchableOpacity>

            {/* 提示信息 */}
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>
                默认账户: admin / admin123
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    fontSize: 14,
    color: '#ff6b6b',
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  hintContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default LoginScreen;
