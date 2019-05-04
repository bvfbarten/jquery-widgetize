var morphdom = require ('morphdom');
var mustache = require ('mustache');
var ObjectHelpers = {
    deepSet : require('utils-deep-set'),
    deepGet : require('utils-deep-get')
};

(function ( $ ) {
    $.fn.widgetize = function(template, options, thirdParameter ) {
        function getTag(element, content){
            var $e = $(element);
            if($e.html()){
                return $e.prop('outerHTML').replace($e.html(), content);
            } else {
                return $e.prop('outerHTML').replace('><', '>' + content + '<');
            }
        }
        function preProcess(e, template){
            var rtn = template
            if(self.getSettings().data){
                rtn = mustache.render(template, self.getSettings().data);
            }
            return getTag(e, rtn);

        }
        function setIdsInData(data){
            if(typeof(data) == 'object' && data !== null){
                if(data.length){
                    for (var counter = 0;counter < data.length; counter += 1){
                        if(typeof(data[counter]) == 'object' && data[counter]['_id'] == counter){
                            continue;
                        }
                        data[counter]['_id'] = counter
                        setIdsInData(data[counter]);
                    }
                } else {
                    for (key in data){
                        setIdsInData(data[key]);
                    }
                }
            }
        }
        function init(e, options){
            if(options.events){
                for(key in options.events){
                    addEvent(e, key, options.events[key]);     
                }
            }
            $(e).data('ww-init', 1);
        }
        function getIndexById(_data, _id, _key){
            if(!_key){
                _key = "_id";
            }
            for (var counter = 0;counter < _data.length;counter +=1){
                if(_data[counter][_key] == _id){
                    return counter;
                }
            }
        }
        function addEvent(element, key, callable){
            if(key == 'init'){
                callable($(element));
                self.setSettings(key, true)
                return;
            }
            var keyArray = key.split(' ');
            var e = keyArray.shift();
            var identifier = keyArray.join(' ');
            $(element).on(e, identifier, callable);
            self.setSettings(key, true)
        }
        function updateData(path, info){
            return ObjectHelpers.deepSet(
                self.getSettings().data,
                path,
                info,
                { create: true }
            );
        }
        var self = this;
        self.getSettings = function(){
            return self.data('morphdomsettings');
        }
        self.setSettings = function(settings){
            if(settings === undefined){
                settings = {};
            }
            if(!self.data('morphdomsettings')){
                self.data('morphdomsettings', {});
            }
            $.extend(self.data('morphdomsettings'), settings);
            if(settings['updateData']) {
                for (key in settings['updateData']){
                    self.getSettings().data[key] = settings['updateData'][key];
                }
            }
            if(settings['updateEvents']) {
                for (key in settings['updateEvents']){
                    self.getSettings().events[key] = settings['updateEvents'][key];
                }
            }
        }
        if(!this.getSettings()){
            this.setSettings( options );
        } else {
            this.setSettings( options );
        }
        if(template == '_updateData'){
            if(options && thirdParameter){
                return updateData(options, thirdParameter);
            }
        }
        if(template == '_getSettings'){
            if(options){
                return this.getSettings()[options];
            }
            else {
                return this.getSettings();
            }

        }
        if(template == '_getIndexById'){
            return getIndexById(options._arr, options._id, options._key);
        }
        
        if(template !== null && template !== undefined ){
            if(typeof(template) !== "string"){
                template = template.innerHTML;
            }
            self.setSettings({template:template});
        }
        setIdsInData(self.getSettings().data);
        return this.each(function(i, e){
            (function(e){
                window.setTimeout(function(){
                    if(self.getSettings().debug){
                        console.log('debug mode is on: ', preProcess(e, self.getSettings().template));
                        console.log('debug mode is on: ', self.getSettings().data);
                    }
                    morphdom(e, preProcess(e, self.getSettings().template), self.getSettings());
                    if(!$(e).data('ww-init')){
                        init(e, options);
                    } else {

                    }
                    if(self.getSettings().events && self.getSettings().events["render"]){
                        self.getSettings().events["render"](e);
                    }
                }, 1);
            })(e)
        });
    };
 
}( jQuery ));
