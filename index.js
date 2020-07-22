
function FileExists(path) {
    return fh.jetpack.exists(path) === 'file';
}

function AddWeapon(helpers, settings, locals, record) {
    const id = xelib.GetValue(record, 'EDID');

    const model = xelib.GetValue(record, 'MODL\\MODL');
    const modelSub = model.substring(0, model.lastIndexOf('.'))
    const modelWeapon = modelSub + 'Left.nif';
    const modelSheath = modelSub + 'Sheath.nif';

    const fileWeapon = FileExists(locals.dataPath + '\\Meshes\\' + modelWeapon);
    const fileSheath = FileExists(locals.dataPath + '\\Meshes\\' + modelSheath);

    if (!fileWeapon || !fileSheath)
        return;

    // Addons
    const leftWeaponAA = helpers.copyToPatch(locals.templateARMA, true);
    xelib.SetValue(leftWeaponAA, 'EDID', 'DSR_W_' + id + 'AA');
    xelib.AddElementValue(leftWeaponAA, 'Male world model\\MOD2', modelWeapon);    
    xelib.SetFlag(leftWeaponAA, 'BOD2\\First Person Flags', settings.leftBipedSlot, true);

    const leftSheathAA = helpers.copyToPatch(leftWeaponAA, true);
    xelib.SetValue(leftSheathAA, 'EDID', 'DSR_S_' + id + 'AA');
    xelib.AddElementValue(leftSheathAA, 'Male world model\\MOD2', modelSheath);    

    // Armor
    const leftWeapon = helpers.copyToPatch(locals.templateARMO, true);
    xelib.SetValue(leftWeapon, 'EDID', 'DSR_W_' + id);
    xelib.AddElementValue(leftWeapon, 'Armature\\[0]', xelib.LongName(leftWeaponAA));    
    xelib.SetFlag(leftWeapon, 'BOD2\\First Person Flags', settings.leftBipedSlot, true);

    const leftSheath = helpers.copyToPatch(leftWeapon, true);
    xelib.SetValue(leftSheath, 'EDID', 'DSR_S_' + id);
    xelib.AddElementValue(leftSheath, 'Armature\\[0]', xelib.LongName(leftSheathAA));    
    
    // TODO: Requiem Support?

    xelib.AddArrayItem(locals.Keyword.BaseWeapon, 'FormIDs', '', xelib.LongName(record));
    xelib.AddArrayItem(locals.Keyword.LeftWeapon, 'FormIDs', '', xelib.LongName(leftWeapon));
    xelib.AddArrayItem(locals.Keyword.LeftSheath, 'FormIDs', '', xelib.LongName(leftSheath));
}

function AddStaff(helpers, settings, locals, record) {
    const id = xelib.GetValue(record, 'EDID');

    const model = xelib.GetValue(record, 'MODL\\MODL');
    const modelSub = model.substring(0, model.lastIndexOf('.'))
    const modelLeft = modelSub + 'Left.nif';
    const modelRight = modelSub + 'Right.nif';

    const fileLeft = FileExists(locals.dataPath + '\\Meshes\\' + modelLeft);
    const fileRight = FileExists(locals.dataPath + '\\Meshes\\' + modelRight);

    if (!fileLeft || !fileRight)
        return;

    // Addons
    const leftStaffAA = helpers.copyToPatch(locals.templateARMA, true);
    xelib.SetValue(leftStaffAA, 'EDID', 'DSR_LS_' + id + 'AA');
    xelib.AddElementValue(leftStaffAA, 'Male world model\\MOD2', modelLeft);    
    xelib.SetFlag(leftStaffAA, 'BOD2\\First Person Flags', settings.leftBipedSlot, true);

    const rightStaffAA = helpers.copyToPatch(locals.templateARMA, true);
    xelib.SetValue(rightStaffAA, 'EDID', 'DSR_RS_' + id + 'AA');
    xelib.AddElementValue(rightStaffAA, 'Male world model\\MOD2', modelRight);    
    xelib.SetFlag(rightStaffAA, 'BOD2\\First Person Flags', settings.rightBipedSlot, true); 

    // Armor
    const leftStaff = helpers.copyToPatch(locals.templateARMO, true);
    xelib.SetValue(leftStaff, 'EDID', 'DSR_LS_' + id);
    xelib.AddElementValue(leftStaff, 'Armature\\[0]', xelib.LongName(leftStaffAA));    
    xelib.SetFlag(leftStaff, 'BOD2\\First Person Flags', settings.leftBipedSlot, true);

    const rightStaff = helpers.copyToPatch(locals.templateARMO, true);
    xelib.SetValue(rightStaff, 'EDID', 'DSR_RS_' + id);
    xelib.AddElementValue(rightStaff, 'Armature\\[0]', xelib.LongName(rightStaffAA));    
    xelib.SetFlag(rightStaff, 'BOD2\\First Person Flags', settings.rightBipedSlot, true);

    // TODO: Requiem Support?

    xelib.AddArrayItem(locals.Keyword.BaseStaff, 'FormIDs', '', xelib.LongName(record));
    xelib.AddArrayItem(locals.Keyword.LeftStaff, 'FormIDs', '', xelib.LongName(leftStaff));
    xelib.AddArrayItem(locals.Keyword.RightStaff, 'FormIDs', '', xelib.LongName(rightStaff));
}

function AddShield(helpers, settings, locals, record) {
    const id = xelib.GetValue(record, 'EDID');

    const model = xelib.GetValue(record, 'Male world model\\MOD2');
    const modelSub = model.substring(0, model.lastIndexOf('.'))
    const modelOnBack = modelSub + 'OnBack.nif';
    const modelOnBackClk = modelSub + 'OnBackClk.nif';

    const fileOnBack = FileExists(locals.dataPath + '\\Meshes\\' + modelOnBack);
    const fileOnBackClk = FileExists(locals.dataPath + '\\Meshes\\' + modelOnBackClk);

    if (!fileOnBack || !fileOnBackClk)
        return;

    // Addons
    const shieldOnBackAA = helpers.copyToPatch(locals.templateARMA, true);
    xelib.SetValue(shieldOnBackAA, 'EDID', 'DSR_SB_' + id + 'AA');
    xelib.AddElementValue(shieldOnBackAA, 'Male world model\\MOD2', modelOnBack);   
    xelib.SetFlag(shieldOnBackAA, 'BOD2\\First Person Flags', settings.leftBipedSlot, true);
    xelib.SetFlag(shieldOnBackAA, 'BOD2\\First Person Flags', '39 - Shield', true);
    
    const shieldOnBackAAClk = helpers.copyToPatch(shieldOnBackAA, true);
    xelib.SetValue(shieldOnBackAAClk, 'EDID', 'DSR_SBC_' + id + 'AA');
    xelib.AddElementValue(shieldOnBackAAClk, 'Male world model\\MOD2', modelOnBackClk); 

    // Alternate Textures
    if (xelib.GetElement(record, 'Male world model\\MO2S\\[0]')) {
        const altArray = xelib.GetElements(record, 'Male world model\\MO2S', false);
        const newArray1 = xelib.AddElement(shieldOnBackAA, 'Male world model\\MO2S');
        const newArray2 = xelib.AddElement(shieldOnBackAAClk, 'Male world model\\MO2S');

        altArray.forEach(altSet => {
            const altName = xelib.GetValue(altSet, '3D Name');
            const altTexture = xelib.GetValue(altSet, 'New Texture');
            const altIndex = xelib.GetIntValue(altSet, '3D Index');

            const item1 = xelib.AddArrayItem(newArray1, '', '3D Name', altName);
            xelib.SetValue(item1, 'New Texture', altTexture);
            xelib.SetIntValue(item1, '3D Index', altIndex);

            const item2 = xelib.AddArrayItem(newArray2, '', '3D Name', altName);
            xelib.SetValue(item2, 'New Texture', altTexture);
            xelib.SetIntValue(item2, '3D Index', altIndex);
        })
    }

    // Armor
    const shieldOnBack = helpers.copyToPatch(locals.templateARMO, true); 
    xelib.SetValue(shieldOnBack, 'EDID', 'DSR_SB_' + id);
    xelib.SetFlag(shieldOnBack, 'BOD2\\First Person Flags', settings.leftBipedSlot, true);
    xelib.AddElementValue(shieldOnBack, 'Armature\\[0]', xelib.LongName(shieldOnBackAA));   

    const shieldOnBackNPC = helpers.copyToPatch(shieldOnBack, true);
    xelib.SetValue(shieldOnBackNPC, 'EDID', 'DSR_SBN_' + id);
    xelib.SetFlag(shieldOnBackNPC, 'BOD2\\First Person Flags', '39 - Shield', true);

    const shieldOnBackClk = helpers.copyToPatch(shieldOnBack, true);   
    xelib.SetValue(shieldOnBackClk, 'EDID', 'DSR_SBC_' + id);
    xelib.AddElementValue(shieldOnBackClk, 'Armature\\[0]', xelib.LongName(shieldOnBackAAClk)); 

    const shieldOnBackNPCClk = helpers.copyToPatch(shieldOnBackClk, true);
    xelib.SetValue(shieldOnBackNPCClk, 'EDID', 'DSR_SBNC_' + id);
    xelib.SetFlag(shieldOnBackNPCClk, 'BOD2\\First Person Flags', '39 - Shield', true);

    // TODO: Requiem Support?

    xelib.AddArrayItem(locals.Keyword.BaseShield, 'FormIDs', '', xelib.LongName(record));
    xelib.AddArrayItem(locals.Keyword.BackShield, 'FormIDs', '', xelib.LongName(shieldOnBack));
    xelib.AddArrayItem(locals.Keyword.BackShieldNPC, 'FormIDs', '', xelib.LongName(shieldOnBackNPC));
    xelib.AddArrayItem(locals.Keyword.BackShieldClk, 'FormIDs', '', xelib.LongName(shieldOnBackClk));
    xelib.AddArrayItem(locals.Keyword.BackShieldNPCClk, 'FormIDs', '', xelib.LongName(shieldOnBackNPCClk));
}

registerPatcher({
    info: info,
    gameModes: [xelib.gmTES5, xelib.gmSSE],
    settings: {
        label: 'Dual Sheath Redux',
        templateUrl: `${patcherUrl}/partials/settings.html`,
        controller: function($scope) {},
        defaultSettings: {
            leftBipedSlot: '60 - Unnamed',
            rightBipedSlot: '44 - Unnamed'
        }
    },
    requiredFiles: ['Dual Sheath Redux.esp'],
    getFilesToPatch: function(filenames) {
        return filenames;
    },
    execute: (patchFile, helpers, settings, locals) => ({
        customProgress: function(filesToPatch) {
            return 100;
        },
        initialize: () => {
            const fileSkyrim = 'Skyrim.esm';
            const fileMaster = 'Dual Sheath Redux.esp';

            locals = {
                dataPath: xelib.GetGlobal('DataPath'),
                templateARMA: xelib.GetElement(0, `${fileMaster}\\ARMA\\DSR_ARMATemplate`),
                templateARMO: xelib.GetElement(0, `${fileMaster}\\ARMO\\DSR_ARMOTemplate`),
                effectDSR: xelib.GetElement(0, `${fileMaster}\\MGEF\\DualSheathReduxEffect`),
                keywordArmorShield: xelib.EditorID(xelib.GetElement(0, `${fileSkyrim}\\KYWD\\ArmorShield`))
            }

            locals.Keyword = {
                BaseWeapon: xelib.AddElement(patchFile, 'FLST\\FLST'),
                LeftWeapon: xelib.AddElement(patchFile, 'FLST\\FLST'),
                LeftSheath: xelib.AddElement(patchFile, 'FLST\\FLST'),
                BaseStaff: xelib.AddElement(patchFile, 'FLST\\FLST'),
                RightStaff: xelib.AddElement(patchFile, 'FLST\\FLST'),
                LeftStaff: xelib.AddElement(patchFile, 'FLST\\FLST'),
                BaseShield: xelib.AddElement(patchFile, 'FLST\\FLST'),
                BackShield: xelib.AddElement(patchFile, 'FLST\\FLST'),
                BackShieldNPC: xelib.AddElement(patchFile, 'FLST\\FLST'),
                BackShieldClk: xelib.AddElement(patchFile, 'FLST\\FLST'),
                BackShieldNPCClk: xelib.AddElement(patchFile, 'FLST\\FLST')
            }

            helpers.cacheRecord(locals.Keyword.BaseWeapon, "DSR_BaseWeaponList");
            helpers.cacheRecord(locals.Keyword.LeftWeapon, "DSR_LeftWeaponList");
            helpers.cacheRecord(locals.Keyword.LeftSheath, "DSR_LeftSheathList");
            helpers.cacheRecord(locals.Keyword.BaseStaff, "DSR_BaseStaffList");
            helpers.cacheRecord(locals.Keyword.RightStaff, "DSR_RightStaffList");
            helpers.cacheRecord(locals.Keyword.LeftStaff, "DSR_LeftStaffList");
            helpers.cacheRecord(locals.Keyword.BaseShield, "DSR_BaseShieldList");
            helpers.cacheRecord(locals.Keyword.BackShield, "DSR_BackShieldList");
            helpers.cacheRecord(locals.Keyword.BackShieldNPC, "DSR_BackShieldListNPC");
            helpers.cacheRecord(locals.Keyword.BackShieldClk, "DSR_BackShieldListClk");
            helpers.cacheRecord(locals.Keyword.BackShieldNPCClk, "DSR_BackShieldListNPCClk");

            helpers.logMessage(`DSR: Processing records...`);
            let processed = 0

            // Add weapons to list
            const weapons = helpers.loadRecords('WEAP');
            weapons.forEach(record => {
                helpers.addProgress(50/weapons.length);

                if (xelib.EditorID(record) == '')
                    return;

                const equip = xelib.GetValue(record, 'ETYP');
                if ((equip == 'BothHands [EQUP:00013F45]') || (equip == ''))
                    return;

                const anim = xelib.GetValue(record, 'DNAM\\Animation Type');
                switch (anim) {
                    case 'OneHandSword':
                    case 'OneHandAxe':
                    case 'OneHandMace':
                    case 'OneHandDagger':
                        AddWeapon(helpers, settings, locals, record);
                        break;
                    case 'Staff':
                        AddStaff(helpers, settings, locals, record);
                        break;
                    default:
                        return;
                }

                processed += 1;
            });

            helpers.logMessage(`DSR: Processed ${processed} weapon/staff records`);
            processed = 0

            // Add armors to list
            const armors = helpers.loadRecords('ARMO');
            armors.forEach(record => {
                helpers.addProgress(50/armors.length);   

                if (xelib.EditorID(record) == '')
                    return;

                const flag = xelib.GetRecordFlag(record, 'Shield');
                if (!flag)
                    return;

                const keyword = xelib.HasKeyword(record, locals.keywordArmorShield);
                if (!keyword)
                    return;

                AddShield(helpers, settings, locals, record);

                processed += 1;   
            });

            helpers.logMessage(`DSR: Processed ${processed} shield records`);

            // Add lists to effect array
            const effect = xelib.CopyElement(locals.effectDSR, patchFile);
            const script = xelib.GetScript(effect, 'DualSheathReduxEffect');
            const property = xelib.AddScriptProperty(script, 'Lists', 'Array of Object', 'Edited');

            const keywords = Object.values(locals.Keyword);
            for (const prop of keywords) {
                const item = xelib.AddArrayItem(property, 'Value\\[0]', 'Object v2\\FormID', xelib.LongName(prop));
                xelib.SetValue(item, 'Object v2\\Alias', 'None');
            }

            helpers.logMessage('DSR: Finished');
        },
        process: []
    })
});