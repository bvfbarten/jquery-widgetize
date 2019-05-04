# jquery-widgetize

This jquery plugin does three things:
* It allows the use of mustache templates https://mustache.github.io/
* It updates html through diffing/patching rather than through a complete html replace:https://github.com/patrick-steele-idem/morphdom
* it allows organizing of code into widgets.

widgetize accepts two arguments: template, options

on updates, if template is null, then it will grab the template previously used
options have four options:
* data: data to be used in template
* events: events to be used in template
* updateData: use on updates. It will only update matching data
* updateEvents: use on updates, it will only update matching events

<pre>
<div class="itemToBeWidgetized">processing</div>
$('.itemToBeWidgetized').widgetize(
    '<a class="clickable">hello {{ name }}</a>',
    {
        data: {
            name: 'world'
        },
        events: {
            'click .clickable' : function(){
                alert('test');
            }
        }
    }
)
</pre>
