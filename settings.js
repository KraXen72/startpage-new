//TODO update these settings' values when i load the json from localstorage (before generating load from localstorage)
//update from localstorage here

const settings = {
    s: {
        TXT_TITLE: {title: "Settings", type: 'heading'},
        connect: {
            title: `Connect columns`,
            desc: `connects link columns together`,
            type: 'bool',
            key: 'connect',
            classes: ['connect', '']
        },
        compact: {
            title: `Compact links`,
            desc: `make links not take up as much space`,
            type: 'bool',
            key: 'compact',
            classes: ['compact', '']
        },
        leftpic: {
            title: `Move Image to left`,
            desc: `Move image to left instead of top. will have no effect if image is hidden.`,
            type: 'bool',
            key: 'leftpic',
            classes: ['leftpic', '']
        },
        tallpic: {
            title: `Tall left image`,
            desc: `(if Image is on the left) make the image tall (for portrait images)`,
            type: 'bool',
            key: 'tallpic',
            classes: ['tallpic', '']
        },
        slim: {
            title: `Slim container`,
            desc: `max width of container is now 32rem instaed of 40rem`,
            type: 'bool',
            key: 'slim',
            classes: ['slim', '']
        },
        cols: {
            title: `Number of columns`,
            desc: `How many columns to show: either 2 or 3`,
            type: 'sel',
            opts: [3,2],
            key: 'cols',
            classes: ['cols-3', 'cols-2']
        },
        verdana: {
            title: `Use Verdana font`,
            desc: `Use Verdana font instead of Roboto`,
            type: 'bool',
            key: 'verdana',
            classes: ['verdana', '']
        },
        TXT_HIDING: {title: "Hiding elements", type: 'heading'},
        nosearch: {
            title: `Hide Search`,
            desc: '',
            type: 'bool',
            key: 'nosearch',
            classes: ['nosearch', '']
        },
        nopic: {
            title: `Hide Image`,
            desc: '',
            type: 'bool',
            key: 'nopic',
            classes: ['nopic', '']
        },
        notitle: {
            title: `Hide Title`,
            desc: '',
            key: 'notitle',
            type: 'bool',
            classes: ['notitle', '']
        },
        nogreeting: {
            title: `Hide Greeting`,
            desc: '',
            key: 'nogreeting',
            type: 'bool',
            classes: ['nogreeting', '']
        }
    }
}

/**
 * creates a new Setting element
 * @classdesc DOM element for a certain setting element
 */
class SettingElem {
    //s-update is the class for element to watch
    constructor (props) {
        console.log(props)
        /**
         * is the key to get checked when writing an update, for checkboxes it's checked, for selects its value etc. 
         * @type {String} 
         */
        this.updateKey = ''

        /**
         * is the eventlistener to use. for checkbox its be onclick, for select its be onchange etc.
         * @type {String}
         */
        this.updateMethod = ''

        /**
         * save the props from constructor to this class (instance)
         * @type {Object}
         */
        this.props = props

        /**
         * type of this settingElem, can be {'bool' | 'sel' | 'heading'}
         * @type {String} 
         */
        this.type = props.type

        /**
         * if this setting actually changes something and can be updated. titles are immutable
         * @type {Boolean}
         */
        this.mutable = false

        /**
         * innerHTML for settingElement
         * @type {String}
         */
        this.HTML = ''

        switch (props.type) {
            case 'bool':
                this.HTML = `<span class="setting-title" title="${props.desc}">${props.title}</span> 
                <label class="switch">
                    <input class="s-update" type="checkbox" ${props.value ? "checked":""}/>
                    <div class="slider round"></div>
                </label>`
                if (!!props.desc && props.desc !== "") {
                    this.HTML += `<span class="setting-desc" title="${props.desc}">?</span>`
                }
                this.mutable = true
                this.updateKey = `checked`
                this.updateMethod = 'onchange'
                break;
            case 'heading':
                this.HTML = `<h1 class="setting-title">${props.title}</h1>`
                this.mutable = false
                break;
            case 'sel':
                this.HTML = `<span class="setting-title" title="${props.desc}">${props.title}</span> <select class="s-update">${
                    props.opts.map( o => `<option value ="${o}">${o}</option>`).join("") /* create option tags*/
                }</select>`
                if (!!props.desc && props.desc !== "") {
                    this.HTML += `<span class="setting-desc" title="${props.desc}">?</span>`
                }
                this.mutable = true
                this.updateKey = `value`
                this.updateMethod = 'onchange'
                break;
            default:
                this.HTML = `<span class="setting-title">${props.title}</span><span>Unknown setting type</span>`
                this.mutable = false
        }
        
    }
    //this reflects the changes on the actual layout
    /**
     * update the layout through updating global container object
     * @param {{elem: Element, callback: 'normal'|Function}} elemAndCb
     */
    set update({elem, callback}) {
        let target = elem.getElementsByClassName('s-update')[0]
        let value = target[this.updateKey]
        
        //console.log(`dry run: would update '${this.props.key}' to '${value}'`)
        if (callback === 'normal') {
            Container.p[this.props.key] = value //update the main container object that is bound to layout
        } else {
            callback()
        }
        
    }

    /**
     * this initializes the element and its eventlisteners
     * @returns {Element}
    */
    get elem() {
        let w = document.createElement('div')
        w.classList.add("setting")
        w.id = `settingElem-${this.props.key}`
        w.classList.add(this.type) //add bool or title etc
        w.innerHTML = this.HTML

        //add an eventlistener if the setting is mutable
        if (this.mutable) {
            w[this.updateMethod] = () => {
                this.update = {elem: w, callback: 'normal'}
            }
        }
        
        return w //return the element
    }
}

/**
 * initialize settings elements. only call after DOM init. only call once.
 */
function initsettings() {
    //add value key to all settings from the container (after container is initialized)
    for (let i = 0; i < Object.keys(settings.s).length; i++) {
        const setting = settings.s[Object.keys(settings.s)[i]];

        if (setting.type === 'bool' || setting.type === 'sel') {
            setting.value = Container.p[setting.key]
        }   
    }

    //generate the setting elements
    for (let i = 0; i < Object.keys(settings.s).length; i++) {
        const key = Object.keys(settings.s)[i];
        const val = settings.s[key]

        let set = new SettingElem(val)
        document.getElementById("layout-settings").appendChild(set.elem)
    }
    console.log("sucessfully generated settings")
}


