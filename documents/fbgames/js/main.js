(function () {

    'use strict';

    function boot () {

        var settings = window._CCSettings;
        window._CCSettings = undefined;

        if ( !settings.debug ) {
            var uuids = settings.uuids;

            var rawAssets = settings.rawAssets;
            var assetTypes = settings.assetTypes;
            var realRawAssets = settings.rawAssets = {};
            for (var mount in rawAssets) {
                var entries = rawAssets[mount];
                var realEntries = realRawAssets[mount] = {};
                for (var id in entries) {
                    var entry = entries[id];
                    var type = entry[1];
                    // retrieve minified raw asset
                    if (typeof type === 'number') {
                        entry[1] = assetTypes[type];
                    }
                    // retrieve uuid
                    realEntries[uuids[id] || id] = entry;
                }
            }

            var scenes = settings.scenes;
            for (var i = 0; i < scenes.length; ++i) {
                var scene = scenes[i];
                if (typeof scene.uuid === 'number') {
                    scene.uuid = uuids[scene.uuid];
                }
            }

            var packedAssets = settings.packedAssets;
            for (var packId in packedAssets) {
                var packedIds = packedAssets[packId];
                for (var j = 0; j < packedIds.length; ++j) {
                    if (typeof packedIds[j] === 'number') {
                        packedIds[j] = uuids[packedIds[j]];
                    }
                }
            }
        }

        // init engine
        var canvas;

        if (cc.sys.isBrowser) {
            canvas = document.getElementById('GameCanvas');
        }

        if (cc.sys.platform === cc.sys.QQ_PLAY) {
            if (settings.orientation === 'landscape left') {
                BK.Director.screenMode = 2;
            }
            else if (settings.orientation === 'landscape right') {
                BK.Director.screenMode = 3;
            }
            else if (settings.orientation === 'portrait') {
                BK.Director.screenMode = 1;
            }
            initAdapter();
        }

        function setLoadingDisplay () {
            // Loading splash scene
            var topPercnet = 80
            cc.loader.onProgress = function (completedCount, totalCount, item) {
                
                if(intervalHandler && progressPercent > 95){
                    clearInterval(intervalHandler)
                    intervalHandler = null
                    if(progressPercent > 95){
                        progressPercent = 95
                    }
                }

                var percent = (topPercnet - progressPercent)*completedCount / totalCount;
                if(FBInstant && totalCount > 1 && window.FBINIT){
                    if(completedCount == totalCount - 1){
                        topPercnet+=0.1
                    }
                    FBInstant.setLoadingProgress(progressPercent + percent)
                    // console.log("onProgress=",progressPercent,percent,progressPercent + percent,item.content._name,completedCount, totalCount)
                }else if(totalCount){
                    progressPercent++
                    FBInstant.setLoadingProgress(progressPercent)
                }
            };
           
            cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
                
            });
        }

        var onStart = function () {
            cc.view.resizeWithBrowserSize(true);

            if (!false && !false) {
                // UC browser on many android devices have performance issue with retina display
                if (cc.sys.os !== cc.sys.OS_ANDROID || cc.sys.browserType !== cc.sys.BROWSER_TYPE_UC) {
                    cc.view.enableRetina(true);
                }
                if (cc.sys.isBrowser) {
                    setLoadingDisplay();
                }

                if (cc.sys.isMobile) {
                    if (settings.orientation === 'landscape') {
                        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
                    }
                    else if (settings.orientation === 'portrait') {
                        cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
                    }
                    cc.view.enableAutoFullScreen([
                        cc.sys.BROWSER_TYPE_BAIDU,
                        cc.sys.BROWSER_TYPE_WECHAT,
                        cc.sys.BROWSER_TYPE_MOBILE_QQ,
                        cc.sys.BROWSER_TYPE_MIUI,
                    ].indexOf(cc.sys.browserType) < 0);
                }
                
                // Limit downloading max concurrent task to 2,
                // more tasks simultaneously may cause performance draw back on some android system / brwosers.
                // You can adjust the number based on your own test result, you have to set it before any loading process to take effect.
                if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_ANDROID) {
                    cc.macro.DOWNLOAD_MAX_CONCURRENT = 2;
                }
            }

            // init assets
            cc.AssetLibrary.init({
                libraryPath: 'res/import',
                rawAssetsBase: 'res/raw-',
                rawAssets: settings.rawAssets,
                packedAssets: settings.packedAssets,
                md5AssetsMap: settings.md5AssetsMap
            });

            var launchScene = settings.launchScene;

            // load scene
            cc.director.loadScene(launchScene, null,
                function () {
                    if (cc.sys.isBrowser) {
                        // show canvas
                        canvas.style.visibility = '';
                        var div = document.getElementById('GameDiv');
                        if (div) {
                            div.style.backgroundImage = '';
                        }
                    }
                    cc.loader.onProgress = null;
                    // console.log('Success to load scene: ' + launchScene);
                }
            );
        };

        // jsList
        var jsList = settings.jsList;
        var bundledScript = settings.debug ? 'src/project.dev.js' : 'src/project.js';
        if (jsList) {
            jsList = jsList.map(function (x) { return 'src/' + x; });
            jsList.push(bundledScript);
        }
        else {
            jsList = [bundledScript];
        }

        // anysdk scripts
        if (cc.sys.isNative && cc.sys.isMobile) {
            jsList = jsList.concat(['src/anysdk/jsb_anysdk.js', 'src/anysdk/jsb_anysdk_constants.js']);
        }


        var option = {
            //width: width,
            //height: height,
            id: 'GameCanvas',
            scenes: settings.scenes,
            debugMode: settings.debug ? cc.DebugMode.INFO : cc.DebugMode.ERROR,
            showFPS: (!false && !false) && settings.debug,
            frameRate: 60,
            jsList: jsList,
            groupList: settings.groupList,
            collisionMatrix: settings.collisionMatrix,
            renderMode: 0
        }
       
        cc.game.run(option, onStart);
        
       
    }

    if (false) {
        (function () {
            var require = function (url) {
                BK.Script.loadlib('GameRes://' + url);
            };
            require('libs/qqplay-adapter.js');
            require('src/settings.js');
            require(window._CCSettings.debug ? 'cocos2d-js.js' : 'cocos2d-js-min.js');
            require('libs/qqplay-downloader.js');
            var prevPipe = cc.loader.md5Pipe || cc.loader.assetLoader;
            cc.loader.insertPipeAfter(prevPipe, qqPlayDownloader);
            boot();
        })();
        return;
    }

    if (false) {
        require(window._CCSettings.debug ? 'cocos2d-js.js' : 'cocos2d-js-min.js');
        var prevPipe = cc.loader.md5Pipe || cc.loader.assetLoader;
        cc.loader.insertPipeAfter(prevPipe, wxDownloader);
        boot();
        return;
    }

    if (window.jsb) {
        require('src/settings.js');
        require('src/jsb_polyfill.js');
        boot();
        return;
    }

    if (window.document) {
        window.FBINIT = false 
        var intervalHandler = null
        var progressPercent = 0
        FBInstant.initializeAsync().then(function () {
            window.FBINIT = true
            progressPercent++
            FBInstant.setLoadingProgress(progressPercent)
            intervalHandler = setInterval(function () {
               
                if(progressPercent < 30){
                     progressPercent++
                 }else  if(progressPercent < 60){
                    progressPercent+= 0.5
                }else  if(progressPercent < 95){
                    progressPercent+= 0.2
                }
               
                FBInstant.setLoadingProgress(progressPercent)
           },200)
            
        })
        // console.log("00",performance.now())
        var cocos2d = document.createElement('script');
        cocos2d.async = true;
        cocos2d.src = window._CCSettings.debug ? 'cocos2d-js.js' : 'cocos2d-js-min.js';

        var engineLoaded = function () {
            document.body.removeChild(cocos2d);
            cocos2d.removeEventListener('load', engineLoaded, false);
            window.eruda && eruda.init() && eruda.get('console').config.set('displayUnenumerable', false);
            boot();
        };
        cocos2d.addEventListener('load', engineLoaded, false);
        document.body.appendChild(cocos2d);
    }

})();
