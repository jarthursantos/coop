import React, {useState, useCallback} from 'react';
import {Animated} from 'react-native';
import {useDispatch} from 'react-redux';

import {useFocusEffect} from '@react-navigation/native';

import Background from '~/components/Background';
import Category from '~/pages/Settings/Category';
import Header from '~/pages/Settings/Header';
import {useTypedSelector} from '~/store';
import {switchTheme} from '~/store/modules/settings/actions';
import {Themes} from '~/themes';

import {Container} from './styles';

const Appearence: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTypedSelector(state => state.settings.theme);

  const [opacity] = useState(new Animated.Value(0));
  const [scrollOffset] = useState(new Animated.Value(0));
  const [scrollEvents] = useState([
    {
      nativeEvent: {
        contentOffset: {y: scrollOffset},
      },
    },
  ]);

  useFocusEffect(
    useCallback(() => {
      Animated.timing(opacity, {
        duration: 250,
        toValue: 1,
      }).start();
    }, [opacity]),
  );

  return (
    <Background>
      <Container
        scrollEventThrottle={10}
        onScroll={Animated.event(scrollEvents)}
        style={{
          opacity: opacity,
        }}>
        <Category
          title="Tema"
          description={theme === Themes.dark ? 'Escuro' : 'Claro'}
          icon="format-paint"
          onPress={() =>
            dispatch(
              switchTheme(theme === Themes.dark ? Themes.light : Themes.dark),
            )
          }
        />
      </Container>

      <Header title="Aparência" offset={scrollOffset} />
    </Background>
  );
};

export default Appearence;
