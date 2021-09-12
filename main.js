let toggle, settbtn, containerElem

const containerObj = {
    p: { //props
        connect: false, //.connect: connects links together
        compact: false, //.compact: make links compact
        slim: false, //.slim: max width is now 32rem instaed of 40rem
        cols: 3, //.cols-2 || .cols-3: show either 1,2,3 or just 1,2 columns
        verdana: false, //.verdana: use verdana font
        nosearch: false, //.nosearch: hide search bar
        nopic: false, //.nopic: hide pic
        notitle: false, //.notitle: hide category titles
        nogreeting: true, //.nogreeting:	hide greeting
        leftpic: false, //.leftpic: put the pic to the left instead of top
        tallpic: false //.tallpic: pic will be yahallo (358*279.72px) tall and wide (only works with leftpic)
    }
}

/**
 * Container is the main object for layout; if you change its props, the layout instantly updates.
 */
const Container = Observable.from(containerObj)
Container.observe(changes => {
    changes.forEach(change => {

        if (change.path[0] === "p") {
            key = change.path[1]
            console.log(`detected ${change.type} in '${key}': `, change)

            if (key === "cols") {
                //if its not 2 or 3 just dont change anything
                change.value = [2,3].includes(change.value) ? change.value : Container.p.cols

                let cl = [...containerElem.classList] //backup classlist
                cl[1] = `cols-${change.value}`
                containerElem.classList = cl.join(" ") //reconstruct classlists
            } else {
                //if new value is true, add the class otherwise remove the class 
                if (change.value === true) {
                    containerElem.classList.add(key)
                } else {
                    containerElem.classList.remove(key)
                }

                //make tallpic not work when leftpic is off & update the checkboxes in settings
                if (key === "leftpic" && !change.value) { 
                    Container.p.tallpic = false; 
                    document.getElementById("settingElem-tallpic").querySelector(".s-update").checked = false;
                }
                if (key === "tallpic" && change.value && !Container.p.leftpic) {
                    Container.p.tallpic = false;
                    setTimeout(() => {document.getElementById("settingElem-tallpic").querySelector(".s-update").checked = false;}, 150)
                }
            }
        } else if (change.path.length === 1 && change.type === "insert") {
            console.log("unsupported change, reverting.")
            delete Container[change.path[0]]
        } else {
            if (!change.type === "delete") {
                console.warn(`you assigned some random bs deep in the object and its not a prop, that's on you man`)
            }
        }

    }) //cols-2 leftpic tallpic slim verdana nosearch notitle compact connect
})

//TODO instangly update classlist from json, not through this for loop - save classList and Container separately

document.addEventListener('DOMContentLoaded', () => {
    toggle = document.getElementById('toggle');
    settbtn = document.getElementById('settings');

    containerElem = document.getElementById('container')

    toggle.onclick = toggleImage
    settbtn.onclick = toggleSettings

    initsettings()
})

/**
 * toggle the image visible or hidden
 */
function toggleImage() {
    document.getElementById('settingElem-nopic').querySelector('.s-update').click()
}

/**
 * toggle the visibility of settings screen
 */
function toggleSettings() {
    document.getElementById('settings-screen').classList.toggle('hidden')
}