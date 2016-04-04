'use strict';

import angular from './angular';

let app = angular.module('app', [
    'ionic',
    'ngCordova'
]);

app.run([
    '$rootScope',
    '$document',
    '$ionicPlatform',
    '$cordovaDevice',
    '$cordovaAppVersion',
    '$cordovaNetwork',
    '$cordovaBarcodeScanner',
    '$cordovaDialogs',
    '$cordovaPushV5',
    '$cordovaInAppBrowser',
    '$cordovaStatusbar',
    '$cordovaKeyboard',
    '$cordovaBadge',
    '$ionicLoading',
    (
        $rootScope,
        $document,
        $ionicPlatform,
        $cordovaDevice,
        $cordovaAppVersion,
        $cordovaNetwork,
        $cordovaBarcodeScanner,
        $cordovaDialogs,
        $cordovaPushV5,
        $cordovaInAppBrowser,
        $cordovaStatusbar,
        $cordovaKeyboard,
        $cordovaBadge,
        $ionicLoading
    ) => {
        window.$rootScope = $rootScope;
        ionic.Platform.ready(() => {
            // badge
            $rootScope.badge = {
                count: 0,
                permission: false,
                set: (badge, callback, scope) => {
                    return $cordovaBadge.set(badge, callback, scope);
                },

                get: () => {
                    return $cordovaBadge.get().then((badge) => {
                        $rootScope.badge.count = badge
                    }, () => {

                    });
                },

                clear: (callback, scope) => {
                    return $cordovaBadge.clear(callback, scope);
                },

                increase: (count = 1, callback, scope) => {
                    return $cordovaBadge.increase(count, callback, scope);
                },

                decrease: (count = 1, callback, scope) => {
                    return $cordovaBadge.decrease(count, callback, scope);
                },
            }
            $cordovaBadge.get();
            // $cordovaBadge.hasPermission().then(() => {
            //     $rootScope.badge.permission = true;
            // }, () => {
            //     $rootScope.badge.permission = false;
            // });

            // $ionicPlatform.on('resume', () => {
            //     $rootScope.badge.set(0);
            // });

            // push
            $rootScope.push = {
                registrationId: null,
                notification: {},
                unregister: (options = {}) => {
                    // WARNING! dangerous to unregister (results in loss of tokenID)
                    return $cordovaPush.unregister(options).then(function(result) {
                        // Success!
                    }, () => {
                        // Error
                    });
                }
            };
            $cordovaPushV5.initialize({
                android: {
                    senderID: '',
                    // Optional. The name of a drawable resource to use as the small-icon. The name should not include the extension.
                    icon: null,
                    // Optional. Sets the background color of the small icon on Android 5.0 and greater. Supported Formats
                    iconColor: null,
                    // Optional. If true it plays the sound specified in the push data or the default system sound.
                    sound: true,
                    // Optional. If true the device vibrates on receipt of notification.
                    vibrate: true,
                    // Optional. If true the app clears all pending notifications when it is closed.
                    clearNotifications: true,
                    // Optional. Controls the behavior of the notification when app is in foreground. If true and app is in foreground, it will show a notification in the notification drawer, the same way as when the app is in background (and on('notification') callback will be called only when the user clicks the notification). When false and app is in foreground, the on('notification') callback will be called immediately.
                    forceShow: false,
                    // Optional. If the array contains one or more strings each string will be used to subscribe to a GcmPubSub topic.
                    topics: []
                },
                ios: {
                    badge: true,
                    sound: true,
                    alert: true,
                    clearBadge: false
                }
            }).then((push) => {
            });

            $cordovaPushV5.register().then((registrationId) => {
                $document.triggerHandler('push-registration', registrationId);
                $rootScope.push.registrationId = registrationId;
            }, (error) => {
                $document.triggerHandler('push-error', error);
                $rootScope.push.error = error;
            });

            $rootScope.$on('$cordovaPushV5:notificationReceived', (event, notification) => {
                $document.triggerHandler('push-notification', notification);
                $rootScope.push.notification = notification;
                // The text of the push message sent from the 3rd party service.
                let message = notification.message;
                // The optional title of the push message sent from the 3rd party service.
                let title = notification.title;
                // The number of messages to be displayed in the badge iOS or message count in the notification shade in Android. For windows, it represents the value in the badge notification which could be a number or a status glyph.
                let count = notification.count;
                // The name of the sound file to be played upon receipt of the notification.
                let sound = notification.sound;
                // The path of the image file to be displayed in the notification.
                let image = notification.image;
                // An optional collection of data sent by the 3rd party push service that does not fit in the above properties.
                let additionalData = notification.additionalData;
                // Whether the notification was received while the app was in the foreground
                let foreground = notification.additionalData.foreground;
                // Will be true if the application is started by clicking on the push notification, false if the app is already started. (Android/iOS only)
                let coldstart = notification.additionalData.coldstart;

                if (sound) {
                    try {
                        let media = $cordovaMedia.newMedia(sound);
                        media.play();
                    } catch (e) {

                    }
                }

                if (message) {
                    $cordovaDialogs.alert(message, title);
                }

                if (count !== null) {
                    $cordovaPushV5.setBadgeNumber(count);
                    $rootScope.badge.set(count);
                }
            });

            $rootScope.$on('$cordovaPushV5:errorOccurred', (event, error) => {
                $document.triggerHandler('push-error', error);
                $rootScope.push.error = error;
            });


            // keyboard
            $rootScope.keyboard = {
                isVisible: () => {
                    try {
                        $cordovaKeyboard.isVisible();
                    } catch (e) {

                    }
                },
                hideAccessoryBar: (opt = true) => {
                    try {
                        $cordovaKeyboard.hideAccessoryBar(opt);
                    } catch (e) {

                    }
                },
                disableScroll: (opt = true) => {
                    try {
                        $cordovaKeyboard.disableScroll(opt);
                    } catch (e) {

                    }
                },
                close: () => {
                    try {
                        $cordovaKeyboard.close();
                    } catch (e) {

                    }
                }
            }
            $rootScope.keyboard.hideAccessoryBar(true);

            // device;
            $rootScope.device = {
                cordova: $cordovaDevice.getCordova(),
                model: $cordovaDevice.getModel(),
                platform: $cordovaDevice.getPlatform(),
                uuid: $cordovaDevice.getUUID(),
                version: $cordovaDevice.getVersion(),
                manufacturer: $cordovaDevice.getManufacturer()
            };

            // statusBar
            $rootScope.statusBar = {
                visibility: $cordovaStatusbar.isVisible(),
                overlaysWebView: true,
                style: null,
                styleColor: null,
                styles: [{
                    text: "Default",
                    value: 0
                }, {
                    text: "LightContent",
                    value: 1
                }, {
                    text: "BlackTranslucent",
                    value: 2
                }, {
                    text: "BlackOpaque",
                    value: 3
                }],
                styleColors: [{
                    text: "black",
                    value: "black"
                }, {
                    text: "darkGray",
                    value: "darkGray"
                }, {
                    text: "lightGray",
                    value: "lightGray"
                }, {
                    text: "white",
                    value: "white"
                }, {
                    text: "gray",
                    value: "gray"
                }, {
                    text: "red",
                    value: "red"
                }, {
                    text: "green",
                    value: "green"
                }, {
                    text: "blue",
                    value: "blue"
                }, {
                    text: "cyan",
                    value: "cyan"
                }, {
                    text: "yellow",
                    value: "yellow"
                }, {
                    text: "magenta",
                    value: "magenta"
                }, {
                    text: "orange",
                    value: "orange"
                }, {
                    text: "purple",
                    value: "purple"
                }, {
                    text: "brown",
                    value: "brown"
                }],
                changed: () => {
                    $cordovaStatusbar.overlaysWebView($rootScope.statusBar.overlaysWebView);
                    $cordovaStatusbar.style($rootScope.statusBar.style.value);
                    $cordovaStatusbar.styleColor($rootScope.statusBar.styleColor.value);

                    // $cordovaStatusbar.styleHex('#000');
                    if ($rootScope.statusBar.visibility === true) {
                        return $cordovaStatusbar.show();
                    } else {
                        return $cordovaStatusbar.hide();
                    }
                }
            };
            $rootScope.statusBar.style = $rootScope.statusBar.styles[0]
            $rootScope.statusBar.styleColor = $rootScope.statusBar.styleColors[0]

            // app version
            $rootScope.app = {};
            if ($cordovaAppVersion.getVersion !== undefined) {
                $cordovaAppVersion.getVersion().then((version) => {
                    $rootScope.app.version = version;
                }, () => {
                    $rootScope.app.version = 'not supported';
                });
            }

            if ($cordovaAppVersion.getVersionNumber !== undefined) {
                $cordovaAppVersion.getVersionNumber().then((version) => {
                    $document.triggerHandler('app-version', version);
                    $rootScope.app.version = version;
                }, false);
            }

            if ($cordovaAppVersion.getVersionCode !== undefined) {
                $cordovaAppVersion.getVersionCode().then((build) => {
                    $rootScope.app.build = build;
                }, false);
            }

            if ($cordovaAppVersion.getAppName !== undefined) {
                $cordovaAppVersion.getAppName().then((name) => {
                    $rootScope.app.name = name;
                }, false);
            }

            if ($cordovaAppVersion.getPackageName !== undefined) {
                $cordovaAppVersion.getPackageName().then((packageName) => {
                    $rootScope.app.package = packageName;
                }, false);
            }

            // network
            let getNetworkState = function(state) {
                switch (state) {
                    case Connection.UNKNOWN:
                        return "UNKNOWN";
                        break;
                    case Connection.ETHERNET:
                        return "ETHERNET";
                        break;
                    case Connection.WIFI:
                        return "WIFI";
                        break;
                    case Connection.CELL_2G:
                        return "CELL_2G";
                        break;
                    case Connection.CELL_3G:
                        return "CELL_3G";
                        break;
                    case Connection.CELL_4G:
                        return "CELL_4G";
                        break;
                    case Connection.CELL:
                        return "CELL";
                        break;
                    case Connection.NONE:
                        return "NONE";
                        break;
                    default:
                        return 'ERROR';
                        break;
                }
            };

            $rootScope.network = {
                state: getNetworkState($cordovaNetwork.getNetwork()),
                online: $cordovaNetwork.isOnline(),
                offline: $cordovaNetwork.isOffline(),
            }
            $rootScope.$on('$cordovaNetwork:online', (event, state) => {
                $document.triggerHandler('network-state', state);
                $rootScope.network.state = getNetworkState(state);
                $rootScope.network.online = true;
                $rootScope.network.offline = false;
            });

            $rootScope.$on('$cordovaNetwork:offline', (event, state) => {
                $document.triggerHandler('network-state', state);
                $rootScope.network.state = getNetworkState(state);
                $rootScope.network.online = false;
                $rootScope.network.offline = true;
            });

            // barcodeScanner
            let barcodeScannerOpen = false;
            $rootScope.barcodeScanner = () => {
                $ionicLoading.show({
                    template: 'loading'
                });
                if (barcodeScannerOpen === true) {
                    return;
                }
                barcodeScannerOpen = true;
                $cordovaBarcodeScanner.scan()
                    .then((barcodeData) => {
                        $document.triggerHandler('barcode-scanner', barcodeData);
                        barcodeScannerOpen = false;
                        $ionicLoading.hide();
                    }, (error) => {
                        $ionicLoading.hide();
                        $cordovaDialogs.alert('請檢查相機功能是否開啟...');
                        barcodeScannerOpen = false;
                    })
            }

            $rootScope.inAppBrowser = (url = 'http://tw.yahoo.com', target = '_self', options = {
                location: 'yes',
                clearcache: 'no',
                toolbar: 'yes',
                enableviewportscale: 'yes'
            }) => {
                // $cordovaInAppBrowser
                return $cordovaInAppBrowser.open(url, target, options);
            }

            $rootScope.$apply();
        });
    }
])

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$cordovaInAppBrowserProvider',
    (
        $stateProvider,
        $urlRouterProvider,
        $cordovaInAppBrowserProvider
    ) => {
        $cordovaInAppBrowserProvider.setDefaultOptions({
            location: 'yes',
            clearcache: 'no',
            toolbar: 'yes',
            enableviewportscale: 'yes'
        });

        $stateProvider
            .state('app', {
                url: '/app',
                controller: 'AppCtrl',
                templateUrl: 'templates/app.html'
            })

        $urlRouterProvider.otherwise('/app');
    }
]);

app.controller('AppCtrl', [
    '$scope',
    ($scope) => {

    }
]);
