import * as React from 'react';
import {Appearance, StatusBar} from 'react-native';

// constants
import {device} from './src/constants';
import {colors} from './src/constants';

// main navigation stack
import RootStack from './src/navigation/RootStack';

// redux
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
    // get system preference
    const colorScheme = Appearance.getColorScheme();

    // if light or dark
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

            <RootStack theme={theme} />
          </React.Fragment>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
