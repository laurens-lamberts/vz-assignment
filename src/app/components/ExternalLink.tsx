import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { cloneElement, isValidElement, type ReactElement } from 'react';
import { Linking, Platform, Pressable, type GestureResponderEvent } from 'react-native';

type Props = {
  href: string;
  asChild?: boolean;
  children: ReactElement | React.ReactNode;
};

export function ExternalLink({ href, asChild, children }: Props) {
  const onPress = async (event: GestureResponderEvent) => {
    if (Platform.OS === 'web') {
      Linking.openURL(href);
      return;
    }
    event.preventDefault();
    await openBrowserAsync(href, {
      presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
    });
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(
      children as ReactElement<{ onPress?: (event: GestureResponderEvent) => void }>,
      {
        onPress,
      },
    );
  }

  return <Pressable onPress={onPress}>{children}</Pressable>;
}
