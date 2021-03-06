import React, {useState, useEffect, useCallback} from 'react';
import {Alert, TouchableWithoutFeedback} from 'react-native';
import Picker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

import BottomSheet from '~/components/BottomSheet';
import Title from '~/components/BottomSheet/Title';
import {
  checkCameraPermission,
  requestCameraPermission,
  CheckPermissionResults,
  RequestPermissionResults,
} from '~/services/permissions';

import {
  Wrapper,
  Row,
  RoundButton,
  IconContainer,
  Label,
  EmptyContainer,
} from './styles';

interface Props {
  isOpenned: boolean;
  onClose(): void;
}

const ImagePicker: React.FC<Props> = ({isOpenned, onClose}) => {
  const [isVisible, setVisible] = useState(false);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleRequestPermissions = useCallback(async () => {
    const requestResult = await requestCameraPermission();

    switch (requestResult) {
      case RequestPermissionResults.GRANTED:
        setVisible(true);
        break;
      case RequestPermissionResults.DENIED:
        handleClose();
        break;
    }
  }, [handleClose]);

  const handleCameraPicker = useCallback(() => {
    Picker.launchCamera({}, response => {
      console.log(response);
    });
  }, []);

  const handleGalleryPicker = useCallback(() => {
    Picker.launchImageLibrary({}, response => {
      console.log(response);
    });
  }, []);

  useEffect(() => {
    if (isOpenned) {
      (async () => {
        const checkResult = await checkCameraPermission();

        switch (checkResult) {
          case CheckPermissionResults.GRANTED:
            setVisible(true);
            break;
          case CheckPermissionResults.DENIED:
            handleRequestPermissions();
            break;
          default:
            Alert.alert('Erro', 'Não foi possível acessar sua câmera/galeria');
            handleClose();
            break;
        }
      })();
    } else {
      setVisible(false);
    }
  }, [handleClose, isOpenned, handleRequestPermissions]);

  return (
    <BottomSheet isVisible={isVisible} onClose={handleClose}>
      <Wrapper>
        <Title>Selecionar a fonte</Title>
        <Row>
          <TouchableWithoutFeedback onPress={handleCameraPicker}>
            <RoundButton>
              <IconContainer>
                <Icon name="camera-alt" size={24} color="#666" />
              </IconContainer>

              <Label>Câmera</Label>
            </RoundButton>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={handleGalleryPicker}>
            <RoundButton>
              <IconContainer>
                <Icon name="photo" size={24} color="#666" />
              </IconContainer>

              <Label>Galeria</Label>
            </RoundButton>
          </TouchableWithoutFeedback>

          <EmptyContainer />
        </Row>
      </Wrapper>
    </BottomSheet>
  );
};

export default ImagePicker;
