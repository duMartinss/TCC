import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Modal, FlatList } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { launchImageLibrary } from 'react-native-image-picker';
import { colors } from "../utils/colors";



export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const navigation = useNavigation();
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const response = await fetch(`http://10.0.2.2:3000/api/usuario/${userId}`);
          if (!response.ok) {
            throw new Error('Erro ao buscar dados do usuário');
          }
          const data = await response.json();
          setUser(data);
          setProfileImage(data.imagem_user || require('../assets/senai.png'));
        } else {
          Alert.alert("Erro", "Usuário não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={30} color="black" />
        </TouchableOpacity>
        
        
          <Image
            source={profileImage ? { uri: profileImage } : require('../assets/user.png')}
            style={styles.perfilImage}
          />

        <View style={styles.userInfo}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.infoText}>{user?.nome_user}</Text>

          <Text style={styles.label}>Nascimento</Text>
          <Text style={styles.infoText}>{user ? new Date(user.nascimento_user).toLocaleDateString('pt-BR') : ''}</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.infoText}>{user?.email_user}</Text>

          <Text style={styles.label}>Telefone</Text>
          <Text style={styles.infoText}>{user?.telefone_user}</Text>

          <Text style={styles.label}>Cidade</Text>
          <Text style={styles.infoText}>{user?.cidade_user}</Text>

          <Text style={styles.label}>Estado</Text>
          <Text style={styles.infoText}>{user?.estado_user}</Text>
        </View>
      </View>

      <Modal
        visible={showAvatarModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAvatarModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Escolha sua foto de perfil</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    paddingVertical: 90,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  perfilContainer: {
    marginBottom: 20,
    borderColor: 'black',
    borderWidth: 3,
    borderRadius: 200,
  },
  perfilImage: {
    width: 180,
    height: 180,
    borderRadius: 200,
    resizeMode: 'contain'
  },
  userInfo: {
    width: '80%',
    backgroundColor: '#f0f0f0',
    padding: 30,
    borderRadius: 10,
    marginVertical: 20,
  },
  label: {
    color: '#AD0000',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  backButton: {
    position: 'absolute',
    top: -40, 
    left: 10,
    zIndex: 11,
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.darkred,
  },
  closeButton: {
    padding: 5,
  },
  avatarGrid: {
    paddingVertical: 10,
  },
  avatarItem: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.darkred,
  },
});
