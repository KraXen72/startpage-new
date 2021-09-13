//TODO update these settings' values when i load the json from localstorage (before generating load from localstorage)
//update from localstorage here

/**
 * creates a new Setting element
 * @classdesc DOM element for a certain setting element
 */
class SettingElem {
    //s-update is the class for element to watch
    //updateKey is the key to get checked when writing an update, for checkboxes it's checked, for selects its value etc.
    //updateMethod is the eventlistener to use. for checkbox its be onclick, for select its be onchange etc.
    //mutable: if this setting actually changes something and can be updated. titles are immutable
    //props: save the props from constructor to this class
    //type: bool, sel, heading etc
    constructor (props) {
        this.props = props
        this.type = props.type
        
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
     * @param {Object} elemAndCb {elem: element to get setting from, callback: callback or 'normal' for normal callback}
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

    //this initializes the element and its eventlisteners
    get elem() {
        let w = document.createElement('div')
        w.classList.add("setting")
        w.id = `settingElem-${this.props.key}`
        w.classList.add(this.type) //add bool or title etc
        w.innerHTML = this.HTML

        //add an eventlistener if the setting is mutable
        if (this.mutable) {
            console.log(this.updateMethod)
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
    const settings = {
        leftpic: false, //.leftpic: put the pic to the left instead of top
        tallpic: false, //.tallpic: pic will be yahallo (358*279.72px) tall and wide (only works with leftpic)
    
        s: {
            TXT_TITLE: {title: "Settings", type: 'heading'},
            connect: {
                value: Container.p["connect"],
                title: `Connect columns`,
                desc: `connects link columns together`,
                type: 'bool',
                key: 'connect',
                classes: ['connect', '']
            },
            compact: {
                value: Container.p["compact"],
                title: `Compact links`,
                desc: `make links not take up as much space`,
                type: 'bool',
                key: 'compact',
                classes: ['compact', '']
            },
            leftpic: {
                value: Container.p["leftpic"],
                title: `Move Image to left`,
                desc: `Move image to left instead of top. will have no effect if image is hidden.`,
                type: 'bool',
                key: 'leftpic',
                classes: ['leftpic', '']
            },
            tallpic: {
                value: Container.p["tallpic"],
                title: `Tall left image`,
                desc: `(if Image is on the left) make the image tall (for portrait images)`,
                type: 'bool',
                key: 'tallpic',
                classes: ['tallpic', '']
            },
            slim: {
                value: Container.p["slim"],
                title: `Slim container`,
                desc: `max width of container is now 32rem instaed of 40rem`,
                type: 'bool',
                key: 'slim',
                classes: ['slim', '']
            },
            cols: {
                value: Container.p["cols"],
                title: `Number of columns`,
                desc: `How many columns to show: either 2 or 3`,
                type: 'sel',
                opts: [3,2],
                key: 'cols',
                classes: ['cols-3', 'cols-2']
            },
            verdana: {
                value: Container.p["verdana"],
                title: `Use Verdana font`,
                desc: `Use Verdana font instead of Roboto`,
                type: 'bool',
                key: 'verdana',
                classes: ['verdana', '']
            },
            TXT_HIDING: {title: "Hiding elements", type: 'heading'},
            nosearch: {
                value: Container.p["nosearch"],
                title: `Hide Search`,
                desc: '',
                type: 'bool',
                key: 'nosearch',
                classes: ['nosearch', '']
            },
            nopic: {
                value: Container.p["nopic"],
                title: `Hide Image`,
                desc: '',
                type: 'bool',
                key: 'nopic',
                classes: ['nopic', '']
            },
            notitle: {
                value: Container.p["notitle"],
                title: `Hide Title`,
                desc: '',
                key: 'notitle',
                type: 'bool',
                classes: ['notitle', '']
            },
            nogreeting: {
                value: Container.p["nogreeting"],
                title: `Hide Greeting`,
                desc: '',
                key: 'nogreeting',
                type: 'bool',
                classes: ['nogreeting', '']
            }
        },
        //add option to generate settings elements here by type + add some headings
    }

    for (let i = 0; i < Object.keys(settings.s).length; i++) {
        const key = Object.keys(settings.s)[i];
        const val = settings.s[key]

        let set = new SettingElem(val)
        document.getElementById("layout-settings").appendChild(set.elem)
    }
    console.log("sucessfully generated settings")
}


