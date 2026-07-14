# FavQs App

Expo app built for Vodafone Ziggo's assignment, using React Navigation with a custom dev client.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

   Or build and run directly on a device/simulator:

   ```bash
   npm run ios      # iOS
   npm run android   # Android
   ```

## How I handled this assessment

According to specification, I built a quotes viewer with option to mark as favorite, and manage the favorites.

I initialized the project with the expo CLI, then used AI to tweak the basic structure to match my preferred code-style and project layout. From there, I pulled in some component primitives that I regularly use, and started on the objective implementation.

Nowadays I would use react-native-mmkv instead of asyncstorage as it is likely to perform (slightly) better, but I followed the specification. I used bare react-navigation over expo-router, as this is my personal preference. I prefer declarative code for my navigation structure over folder-based. Furthermore, I used inline-styling throughout screens and components. I prefer when styling and JSX code are at the same spot, so I can interpret the code with styling and make a mental picture of what the code is doing (for me this works better than using stylesheets/styled components/nativewind). This also saves in scrolling up and down often while working on components and screens. Extracting code into components often helps preventing duplicate style definitions. But usually I would conform to the client preference on this.

Usually I would apply internationalization, but I figured that would be out of scope for this assessment. A production-ready app would also need a custom icon, splash screen, CI configuration and such, but I left those out for now. Same as user-configurable settings for appearance mode and such. Also, I would usually align with the client in what order they prefer native feel over cross-platform consistency.

I made sure the typescript compiler and eslint are both happy before making the final commit and sending the repository in.
