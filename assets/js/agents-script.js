// SELECTORS
const hamburger = document.querySelector(".hamburger");
const bar = document.querySelectorAll(".bar");
const navMenu = document.querySelector(".nav-menu");
const sovaImg = document.querySelectorAll(".valo-img, .valo-img-cropped");
document.getElementsByName("skill-btn");
document.querySelectorAll(".abilities-ico");
let abilitiesTextHead = document.getElementById("abilities-text-head");
const abilitiesTextBody = document.getElementById("abilities-text-body");
const abilitiesSrc = document.getElementById("abilities-src");
document.querySelector("#agent-name");
document.querySelectorAll(".agent");
const abilities = [
    [
        {
            agent: "Gekko",
            video1: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt79a9f8119f366ad1/64029afe10329144ff021282/Website_Gekko_Wingman_Stun_FNL.mp4",
            video2: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt7a75dbdd9b6c4220/64029b4743153734d1472d59/Website_Gekko_Dizzy_FNL.mp4",
            video3: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltf9f635d9cb6cf999/64029aa343153734d1472d55/Website_Gekko_MoshPit_FNL.mp4",
            video4: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt1a1188dafa478506/64029a1a205f2b7a60b74497/Website_Gekko_Thrash_FNL.mp4",
        }
    ],
    [
        {
            agent: "Fade",
            video1: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltbec73caca7bf1045/62701777bae21939d5444b9e/Q-seize_video_NEW.mp4",
            video2: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt82a21218065dc472/625f2c47fd9afd4b1fe300ea/E-Haunt_video.mp4",
            video3: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltf4e7a6525fe6ec42/625f2c7cfd9afd4b1fe300ee/C-Prowler_video.mp4",
            video4: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt75dfbdc2fbf6bfe1/625f2ba62777714c51b313be/X-Nightfall_Video.mp4",
        }
    ],
    [
        {
            agent: "Deadlock",
            video1: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blta1fbdf10898ac8a4/649497b0f57ecc047c3abf59/AgentPage_Deadlock_Ability_Q.mp4",
            video2: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt91ea123447dc4820/649497a91de9c33b380f43aa/AgentPage_Deadlock_Ability_E.mp4",
            video3: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt5ba97cb2d6cab44e/6494969bf57ecc7db03abf4b/AgentPage_Deadlock_Ability_C.mp4",
            video4: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltd02395a7fa554cd1/6494c187edfc646bc3351296/AgentPage_Deadlock_Ability_X_2.mp4",
        }
    ],
    [
        {
            agent: "Chamber",
            video1: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltc97eeaeb138d2155/618d9fb7867d1817d95f3b2b/VAL_broll_EP03-3_Chamber_Q.mp4",
            video2: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt44b27c0d688217db/5ecad88398f79d6925dbee21/Sova_E_v001_web.mp4",
            video3: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt07d2025ac5dcd792/5ecad883f5bd13348a6cac89/Sova_C_v001_web.mp4",
            video4: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltf9fc34106a23479c/5ecad88397b46c1911ad1872/Sova_X_v001_web.mp4",
        }
    ],
    [
        {
            agent: "Harbor",
            video1: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt7af29765c99f807d/5ecad882722d20585b2f4a48/Sova_Q_v001_web.mp4",
            video2: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt44b27c0d688217db/5ecad88398f79d6925dbee21/Sova_E_v001_web.mp4",
            video3: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt07d2025ac5dcd792/5ecad883f5bd13348a6cac89/Sova_C_v001_web.mp4",
            video4: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltf9fc34106a23479c/5ecad88397b46c1911ad1872/Sova_X_v001_web.mp4",
        }
    ],
    [
        {
            agent: "Neon",
            video1: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltf634e203f29987a5/61d8a91abf9cb8387cc1d9c8/VAL_Neon_Ability-Q_Preview_Stun_noHUD_Web_h264.mp4",
            video2: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt99e20f893b806cc8/61d8a9608aabbf6426b7523a/VAL_Neon_Ability-E_Preview_Sprint_noHUD_Web_h264.mp4",
            video3: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt023814e24e6cad2f/61d8a98914ef402247ceab3a/VAL_Neon_Ability-C_Preview_Walls_noHUD_Web_h264.mp4",
            video4: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltcbe0e9c4b801f025/61d8a9dfef206c6c5e4941ba/VAL_Neon_Ability-X_Preview_Ult_noHUD_Web_h264.mp4",
        }
    ],
    [
        {
            agent: "Sova",
            video1: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt7af29765c99f807d/5ecad882722d20585b2f4a48/Sova_Q_v001_web.mp4",
            video2: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt44b27c0d688217db/5ecad88398f79d6925dbee21/Sova_E_v001_web.mp4",
            video3: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt07d2025ac5dcd792/5ecad883f5bd13348a6cac89/Sova_C_v001_web.mp4",
            video4: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltf9fc34106a23479c/5ecad88397b46c1911ad1872/Sova_X_v001_web.mp4",
        }
    ],
    [
        {   agent: "Astra",
            video1: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt78e556d97ea93fc9/6036c92572c04c12c9563dff/RIFT21_Astra_Ability_Q.mp4",
            video2: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt3be9010588cba144/6036c924427f5d75042c3ae5/RIFT21_Astra_Ability_E_F.mp4",
            video3: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltaba20d81cc601af4/6036c92599494e6c4f166b19/RIFT21_Astra_Ability_C.mp4",
            video4: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltca94f8d6f8e4c91d/6036c92499494e6c4f166b15/RIFT21_Astra_Ability_ULT.mp4",
        }
    ],
    [
        {
            agent: "Breach",
            video1: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltc2d5631f1babcaf0/5ec840e1bab1845d392dfc39/Breach_Q_v001_web.mp4",
            video2: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltd09eb47222cc1152/5ec840e287617619e2be955e/Breach_E_v001_web.mp4",
            video3: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltfff097ebc7da90e9/5ec840e1e2a559592eb0c0e2/Breach_C_v001_web.mp4",
            video4: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt0a47675f8b973fda/5ec840e252c5395e0f2dd038/Breach_X_v001_web.mp4",
        }
    ],
    [
        {
            agent: "Brimstone",
            video1: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blte2b9eb1923ef64fa/5ecad7d0f5bd13348a6cac75/Brimstone_Q_v001_web.mp4",
            video2: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltcf4359fed083686b/5ecad7d198f79d6925dbee07/Brimstone_E_v001_web.mp4",
            video3: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltc34c3d692ea83f41/5ecad7d0177c51692beb1fe4/Brimstone_C_v001_web.mp4",
            video4: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt3d19d83ba51eb18f/5ecad7d297b46c1911ad1868/Brimstone_X_v001_web.mp4",
        }
    ],
    [
        {
            agent: "Cypher",
            video1: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt019fa05d6b7fddef/5ecad7e597b46c1911ad186c/Cypher_Q_v001_web.mp4",
            video2: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt47c03800823ce304/5ecad7e64a28e119db562296/Cypher_E_v001_web.mp4",
            video3: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt9b7d004dc573791c/5ecad7e85e73766852c8ed8c/Cypher_C_v001_web.mp4",
            video4: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt29f3571576a3937f/5ecad7e5e2a559592eb0c1b0/Cypher_X_v001_web.mp4",
        },
    ],
    [
        {
            agent: "Jett",
            video1: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt2c46e5d7a51be140/5ecad7f552c5395e0f2dd0de/Jett_Q_v001_web.mp4",
            video2: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt5368134438181520/5ecad7f6e2a559592eb0c1b4/Jett_E_v001_web.mp4",
            video3: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltb15019d03f48b8c3/5ecad7f7beb6c333c3a0f59d/Jett_C_v001_web.mp4",
            video4: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blta43d8d506e2f5e00/5ecad7f6957e405e0990574d/Jett_X_v001_web.mp4",
        },
    ],
    [
        {
            agent: "KAY/O",
            video1: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltab2fead35a9b412d/60cce5d49b520349ac9d080d/KAYO_C_v002_web.mp4",
            video2: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt11ab79d777cba68e/60cce41a07060a4ae3f12ff1/KAYO_E_v002_web.mp4",
            video3: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt6372c1b58baf8ca2/60cce401ae0d50495b4f7e31/KAYO_Q_v001_web.mp4",
            video4: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt6cd3a6f6e99152f8/60cce43683f9fe49a6fee835/KAYO_X_v003_web.mp4",
        },
    ],
    [
        {
            agent: "Killjoy",
            video1: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt9a8fa11ac887550e/5f2203522f812a7c016f5651/AlarmBot_LowQuality.mp4",
            video2: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt0fe3462ae9a025a4/5f220396074360086ccdd908/Turret_LowQuality.mp4",
            video3: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt4aed833e1b0df155/5f2204694be7297d7e6c8449/Grenade_LowQuality.mp4",
            video4: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltf74d72b162a14692/5f2204ab8ff50d070ad2d192/Ultimate_LowQualityV02.mp4",
        },
    ],
    [
        {
            agent: "Omen",
            video1: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt5babc7e7c6c24fa0/5ecad8154a28e119db56229e/Omen_Q_v001_web.mp4",
            video2: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt70e2c9db1c0793df/5ecad815c846021917ecbb85/Omen_E_v001_web.mp4",
            video3: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt63486e54ea52945a/5ecad815bab1845d392dfd07/Omen_C_v001_web.mp4",
            video4: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt65aa85bf6ba5c0e8/5ecad814a4fe135d37f021a3/Omen_X_v001_web.mp4",
        },
    ],
    [
        {
            agent: "Phoenix",
            video1: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltad7b0ea9be090042/5ecad82c2f5c7259287654ff/Phoenix_Q_v001_web.mp4",
            video2: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt318f7ee7d6435fac/5ecad82cf5bd13348a6cac7d/Phoenix_E_v001_web.mp4",
            video3: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltf0ee7c9d84985ecf/5ecad82d957e405e09905751/Phoenix_C_v001_web.mp4",
            video4: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt50beaed6524c3219/5ecad82bc846021917ecbb89/Phoenix_X_v001_web.mp4",
        },
    ],
    [
        {
            agent: "Raze",
            video1: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltf3581aedf43e1ce8/5ecad83cc846021917ecbb8d/Raze_Q_v001_web.mp4",
            video2: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltfe61b821c26125b7/5ecad83be2a559592eb0c1ba/Raze_E_v001_web.mp4",
            video3: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt3f7d7ee195ecedca/5ecad83c52c5395e0f2dd0e4/Raze_C_v001_web.mp4",
            video4: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltb15aa9cb086aed1a/5ecad83c4a28e119db5622a2/Raze_X_v001_web.mp4",
        },
    ],
    [
        {
            agent: "Reyna",
            video1: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltb216220f42c804e2/5ecad85d4a28e119db5622a8/Reyna_Q_v001_web.mp4",
            video2: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt77e99ec99ef3a839/5ecad85e2f5c725928765503/Reyna_E_v002_web.mp4",
            video3: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltf6109b8be97e8d96/5ecad85db42d3333c95dd1b2/Reyna_C_v002_web.mp4",
            video4: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltadf53a38e449cb4d/5ecad85cbab1845d392dfd0f/Reyna_X_v001_web.mp4",
        },
    ],
    [
        {
            agent: "Sage",
            video1: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt4f4fdcc86da69972/5ecad872722d20585b2f4a44/Sage_Q_v001_web.mp4",
            video2: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltf1d16edc36ba3386/5ecad87152c5395e0f2dd0ea/Sage_E_v001_web.mp4",
            video3: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt5a0edb670c30fbdc/5ecad8732f5c725928765507/Sage_C_v001_web.mp4",
            video4: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltef1820f276fbaa0c/5ecad871957e405e09905755/Sage_X_v001_web.mp4",
        },
    ],
    [
        {
            agent: "Skye",
            video1: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt90a6f2733b96ce16/5f7faa7dd4fbb50ef307791e/Val_Skye_Q_Ability_Web.mp4",
            video2: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt8ecea4a77a26c25b/5f7fab7adf178b0ea98495a5/Val_Skye_E_Ability_Web.mp4",
            video3: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt0f5403509070a0a2/5f7fabc5879de80eb41b1f33/Val_Skye_C_Ability_Web.mp4",
            video4: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt966535853a54c58c/5f7fac19df178b0ea98495ad/Val_Skye_X_Ability_Web.mp4",
        },
    ],
    [
        {
            agent: "Viper",
            video1: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blte5200bab40679f96/5ecad8935e73766852c8ed94/Viper_Q_v001_web.mp4",
            video2: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt66a45c1fe76ca647/5ecad893957e405e0990575d/Viper_E_v001_web.mp4",
            video3: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt5e70987e8ac2f2d6/5ecad893722d20585b2f4a4c/Viper_C_v001_web.mp4",
            video4: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt41c75111b2eac6b5/5ecad8923a450a58554b7078/Viper_X_v001_web.mp4",
        },
    ],
    [
        {
            agent: "Yoru",
            video1: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt9af4e1e3b962f7b4/5ff77b6fa703d10ab87ebb27/Yoru_Abilities_Blinding_1_1.mp4",
            video2: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt0945f456a2bcac77/5ff77b51b529867fcec28402/Yoru_Abilities_Teleport_1_1.mp4",
            video3: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt47c96a79f14605fc/5ff77bc5b47cdf7fc7d6cd31/Yoru_Abilities_Footsteps_1.mp4",
            video4: "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt95a89496da772b65/5ff77c0e6aab641cd100f638/Yoru_Abilities_ULT_3_1.mp4",
        },
    ],
];



/*===== SCROLL REVEAL =====*/
const sr = ScrollReveal({
    origin: "bottom",
    distance: "200px",
    duration: 2000,
});

// EVENT ------------------------------------------------------>

// Header Reveal
sr.reveal(".text-overlay", {origin: "center"})
sr.reveal(".valo-img-container", { distance: "200px", reset: false });
sr.reveal("#agent-name", {});
sr.reveal(".desc-container", { origin: "left" });

// Abilities
sr.reveal(".skill-container h1", { origin: "left" });
sr.reveal(".abilities-ico", { origin: "left" });
sr.reveal(".abilities-text", { origin: "left" });

// Agents Reveal
sr.reveal(".other-agents h1", { origin: "left" });
sr.reveal(".agent", { delay: 500 });
sr.reveal(".play-now", {});

// Add event listener to hamburger bar
hamburger.addEventListener("click", mobileMenu);

// Add class to give animation
function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
    bar.forEach((el) => {
        el.classList.toggle("active");
    });
}

// Make hamburger menu closed once we clicked a link
const navLink = document.querySelectorAll(".nav-link");

navLink.forEach((n) => n.addEventListener("click", closeMenu));

// Give sova image animation
if (sovaImg.length > 0) {
    sovaImg.forEach(sovaImg => {
        window.addEventListener("scroll", () => {
            let value = window.scrollY;
            sovaImg.style.top = value * -0.05 + "vh";

            if (value > 250) {
                sovaImg.style.top = -.50 + "vh";
            }
            if (value === 0) {
                sovaImg.style.top = 10 + "vh";
            }
        });
    });
} else {
    console.error("No elements with the specified classes found.");
}

// FUNCTION ----------------------------------------------------->
function closeMenu() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
    bar.forEach((el) => {
        el.classList.remove("active");
    });
}
// FETCH VALORANT DATA ------------------------------------------>
async function fetchAgent() {
    let response = await fetch('https://valorant-api.com/v1/agents');
    let responseConvert = await response.json();

    const container = document.getElementById('agent-sel');
      responseConvert.data.forEach(item => {
        if (item.isPlayableCharacter) {
            // Create an 'a' element
            const agentLink = document.createElement('a');
            agentLink.href = `agent-info.html?agentId=${item.uuid}`;
            agentLink.className = 'agent';
            agentLink.id = item.uuid;

            // Create an 'img' element
            const img = document.createElement('img');
            img.src = item.displayIconSmall;
            img.alt = `${item.displayName} from the game VALORANT`;

            // Append 'img' element to the 'a' element
            agentLink.appendChild(img);

            // Add a click event listener to the 'a' element
            agentLink.addEventListener('click', () => {
                // Toggle the visibility of the ID
                if (agentLink.textContent === '') {
                    agentLink.textContent = item.uuid;
                    agentData();
                } else {
                    agentLink.textContent = '';
                }
            });
            // Append the 'a' element to the container
            container.appendChild(agentLink);
        }
    });
}
fetchAgent();
// FETCH Agent DATA ------------------------------------------>
// Fetch the agent UUID from the URL
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to fetch and display agent data
async function agentData() {
    const agentUuid = getQueryParameter('agentId');

    if (agentUuid) {
        let response = await fetch(`https://valorant-api.com/v1/agents/${agentUuid}`);
        let responseConvert = await response.json();

        const agentName = document.getElementById('agent-name');
        const titleElement = document.querySelector('title');
        const fullIcon = document.getElementById("fullIcon");
        const aDesc = document.getElementById('agent-description');
        const aType = document.querySelector('.desc-container')
        const numberOfButtons = 4; // Number of buttons to generate
        const abilitiesButtonContainer = document.querySelector(".abilities-button");
        const radioContainer = document.querySelector(".radio-container");

        // Update the agent name and page title
        agentName.textContent = responseConvert.data.displayName.toUpperCase();
        if (!agentName.length > 5 ){
            agentName.style.fontSize = "530%";
        } else {
            agentName.style.fontSize = "600%";
        }
        titleElement.textContent = `Valorant Agent - ${responseConvert.data.displayName}`;


        //Update Agent Icon and Type
        const typeIcon = document.getElementById('typeIcon');
        // Create an 'img' element
        const icon = document.createElement('img');
        icon.src = responseConvert.data.role.displayIcon;
        typeIcon.append(icon);

        typeIcon.append(responseConvert.data.role.displayName.toUpperCase());

        //Update Agent Description
        aDesc.textContent = `${responseConvert.data.description}`;
        aType.appendChild(aDesc);

        // Create an 'img' element
        const img = document.createElement('img');
        img.src = responseConvert.data.fullPortraitV2;
        img.alt=`${responseConvert.data.displayName}-img`;
        img.setAttribute("class", "valo-img-cropped");
        img.id = "fullIcon";
            fullIcon.replaceWith(img);

        for (let i = 0; i < numberOfButtons; i++) {
            // Create a radio input element
            const radioInput = document.createElement("input");
            radioInput.type = "radio";
            radioInput.name = "skill-btn";
            radioInput.className = "radio-btn";
            radioInput.value = i;

            // Append the radio input to the radio container
            radioContainer.appendChild(radioInput);

            // Create a button element
            const button = document.createElement("button");
            button.className = "abilities-ico";
            button.id = i;
            button.onclick = (function (index) {
                return function () {
                    skillBtn(index);
                };
            })(i);

            const img = document.createElement("img");
            if (i === 0) {
                img.src = responseConvert.data.abilities.find(ability => ability.slot === 'Ability1').displayIcon;
            } else if (i === 1) {
                img.src = responseConvert.data.abilities.find(ability => ability.slot === 'Ability2').displayIcon;
            } else if (i === 2) {
                img.src = responseConvert.data.abilities.find(ability => ability.slot === 'Grenade').displayIcon;
            } else if (i === 3) {
                img.src = responseConvert.data.abilities.find(ability => ability.slot === 'Ultimate').displayIcon;
            }

            // Append the img to the button
            button.appendChild(img);
            // Append the button to the button container
            abilitiesButtonContainer.appendChild(button);
        }

    } else {
        // Handle the case where the agentUuid query parameter is not provided
        console.log('Agent UUID not found in the URL');
    }
}

agentData();
// SHOW SKILL VIDEO ------------------------------------------>
async function skillBtn(n) {
    const agentUuid = getQueryParameter('agentId');
    if (agentUuid) {
        let response = await fetch(`https://valorant-api.com/v1/agents/${agentUuid}`);
        let responseConvert = await response.json();
        const agentName = responseConvert.data.displayName;
        console.log(agentName)
        const agentAbilities = abilities.find(agent => agent[0].agent === agentName);
        console.log(agentAbilities)

        if (n === 0) {
            // Ability 1
            abilitiesTextHead.innerHTML = responseConvert.data.abilities.find(ability => ability.slot === 'Ability1').displayName;
            abilitiesTextBody.innerHTML = responseConvert.data.abilities.find(ability => ability.slot === 'Ability1').description;
            abilitiesSrc.classList.add("show");
            abilitiesSrc.src = agentAbilities[0].video1;
            console.log("ability: ", abilitiesSrc)
        } else if (n === 1) {
            // Ability 2
            abilitiesTextHead.innerHTML = responseConvert.data.abilities.find(ability => ability.slot === 'Ability2').displayName;
            abilitiesTextBody.innerHTML = responseConvert.data.abilities.find(ability => ability.slot === 'Ability2').description;
            abilitiesSrc.classList.add("show");
            abilitiesSrc.src = agentAbilities[0].video2;
        } else if (n === 2) {
            // Grenade
            abilitiesTextHead.innerHTML = responseConvert.data.abilities.find(ability => ability.slot === 'Grenade').displayName;
            abilitiesTextBody.innerHTML = responseConvert.data.abilities.find(ability => ability.slot === 'Grenade').description;
            abilitiesSrc.classList.add("show");
            abilitiesSrc.src = agentAbilities[0].video3;
        } else if (n === 3) {
            // Ultimate
            abilitiesTextHead.innerHTML = responseConvert.data.abilities.find(ability => ability.slot === 'Ultimate').displayName;
            abilitiesTextBody.innerHTML = responseConvert.data.abilities.find(ability => ability.slot === 'Ultimate').description;
            abilitiesSrc.classList.add("show");
            abilitiesSrc.src = agentAbilities[0].video4;
        }
    }
}








