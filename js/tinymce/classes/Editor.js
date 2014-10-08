			// Load scripts
			function loadScripts() {
				var scriptLoader = ScriptLoader.ScriptLoader, 
					cacheBuster = '', 
					language = settings.language,
					languageCache = '?_l='+language;
				
				if(settings.cacheBuster){
					cacheBuster = settings.cacheBuster;
					if(cacheBuster.indexOf('?') != 0){
						cacheBuster = '?_v='+cacheBuster;	
					}
					languageCache = '&_l='+language;
				}

				if (language && language != 'en' && !settings.language_url) {
					settings.language_url = self.editorManager.baseURL + '/langs/' + language + '.js' + cacheBuster + languageCache;
				}

				if (settings.language_url) {
					scriptLoader.add(settings.language_url);
				}

				if (settings.theme && typeof settings.theme != "function" &&
					settings.theme.charAt(0) != '-' && !ThemeManager.urls[settings.theme]) {
					var themeUrl = settings.theme_url;

					if (themeUrl) {
						themeUrl = self.documentBaseURI.toAbsolute(themeUrl);
					} else {
						themeUrl = 'themes/' + settings.theme + '/theme' + suffix + '.js' + cacheBuster;
					}

					ThemeManager.load(settings.theme, themeUrl);
				}

				if (Tools.isArray(settings.plugins)) {
					settings.plugins = settings.plugins.join(' ');
				}

				each(settings.external_plugins, function(url, name) {
					PluginManager.load(name, url);
					settings.plugins += ' ' + name;
				});

				each(settings.plugins.split(/[ ,]/), function(plugin) {
					plugin = trim(plugin);

					if (plugin && !PluginManager.urls[plugin]) {
						if (plugin.charAt(0) == '-') {
							plugin = plugin.substr(1, plugin.length);

							var dependencies = PluginManager.dependencies(plugin);

							each(dependencies, function(dep) {
								var defaultSettings = {
									prefix: 'plugins/',
									resource: dep,
									suffix: '/plugin' + suffix + '.js' + cacheBuster
								};

								dep = PluginManager.createUrl(defaultSettings, dep);
								PluginManager.load(dep.resource, dep);
							});
						} else {
							PluginManager.load(plugin, {
								prefix: 'plugins/',
								resource: plugin,
								suffix: '/plugin' + suffix + '.js' + cacheBuster
							});
						}
					}
				});

				scriptLoader.loadQueue(function() {
					if (!self.removed) {
						self.init();
					}
				});
			}

			loadScripts();
		},
