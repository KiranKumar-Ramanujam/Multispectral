import * as React from 'react';
import {Appearance, StatusBar} from 'react-native';

import {device} from './src/constants';
import {colors} from './src/constants';

import Navigation from './src/navigation/RootStack';

import {Provider} from 'react-redux';
import {Store, persistor} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      theme: 'light',
    };

    this.updateTheme = this.updateTheme.bind(this);
  }

  componentDidMount() {
    const colorScheme = Appearance.getColorScheme();

    if (colorScheme !== 'no-preference') {
      this.setState({
        theme: colorScheme,
      });
    }
  }

  updateTheme(themeType) {
    this.setState({
      theme: themeType,
    });
  }

  render() {
    const {isLoading, theme} = this.state;
    const iOSStatusType = theme === 'light' ? 'dark-content' : 'light-content';

    return (
      <Provider store={Store}>
        <PersistGate loading={null} persistor={persistor}>
          <React.Fragment>
            <StatusBar
              barStyle={device.iOS ? iOSStatusType : 'light-content'}
              backgroundColor={colors.statuscolor}
            />

            <Navigation theme={theme} />
          </React.Fragment>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
