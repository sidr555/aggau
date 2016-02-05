/**
 * Author: Dmitry Sidorov
 * Email: sidr@sidora.net
 * Date: 05.02.16
 */

var $$ = Dom7;

var Aggau = new Framework7({
    precompileTemplates: true, //
    template7Pages: true, //enable Template7 rendering for pages
    _compiledTemplates: {}
});

// Initialize View
var mainView = Aggau.addView('.view-main')


/**
 * Ленивая, но одноразовая загрузка и компиляция шаблонов
 * @param id - идентификатор элемента <script type='text/template7' id='{id}'>
 * @returns Template7
 */
Aggau.getTemplate = function(id) {
    if (typeof Aggau._compiledTemplates[id] == "undefined") {
        Aggau._compiledTemplates[id] = Template7.compile($$('script#' + id).html());
    }
    return Aggau._compiledTemplates[id];
}

// загрузим список площадок
$$.getJSON("/places",function(places, code){
    if (places.length) {
        var $parent = $$(".page[data-page='places'] ul");
        _(places).each(function(data){
            data.pagetype = "place";
            $parent.append(Aggau.getTemplate("list-item-template")(data));
        });

        $$(".page[data-page='places'] ul a").on("click", function(event) {
            $el = $$(event.target).parents('a');
            alert("За");
        });
    }
});




