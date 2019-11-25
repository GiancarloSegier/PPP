import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import TabNavigator from '../components/TabNavigator';

const RootStack = createStackNavigator(
  {
    App: TabNavigator,
  },
  {
    headerMode: 'none',
  },
);

const MainNavigator = createAppContainer(RootStack);

export default MainNavigator;
