
function FileExists(path) {
    return fh.jetpack.exists(path) === 'file';
}

function GetBodyTemplate(record) {
    return xelib.GetElement(record, '[BODT|BOD2]');
};

function AddWeapon(settings, locals, record) {
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

    xelib.AddArrayItem(locals.List.keywordBaseWeapon, 'FormIDs', '', xelib.LongName(record));
    xelib.AddArrayItem(locals.List.keywordLeftWeapon, 'FormIDs', '', xelib.LongName(leftWeapon));
    xelib.AddArrayItem(locals.List.keywordLeftSheath, 'FormIDs', '', xelib.LongName(leftSheath));
}

function AddStaff(settings, locals, record) {
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

    xelib.AddArrayItem(locals.List.keywordBaseStaff, 'FormIDs', '', xelib.LongName(record));
    xelib.AddArrayItem(locals.List.keywordLeftStaff, 'FormIDs', '', xelib.LongName(leftStaff));
    xelib.AddArrayItem(locals.List.keywordRightStaff, 'FormIDs', '', xelib.LongName(rightStaff));
}

function AddShield(settings, locals, record) {
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
    xelib.AddElementValue(shieldOnBackAA, 'Male world model\\MOD2', newModel);   
    xelib.SetFlag(shieldOnBackAA, 'BOD2\\First Person Flags', settings.leftBipedSlot, true);
    xelib.SetFlag(shieldOnBackAA, 'BOD2\\First Person Flags', '39 - Shield', true);
    
    const shieldOnBackAAClk = helpers.copyToPatch(shieldOnBackAA, true);
    xelib.SetValue(shieldOnBackAAClk, 'EDID', 'DSR_SBC_' + id + 'AA');
    xelib.AddElementValue(shieldOnBackAAClk, 'Male world model\\MOD2', newModelClk); 

    // Alternate Textures
    const texture = xelib.GetElement(record, 'Male world model\\MO2S\\[0]');
    if (texture) {
        const array1 = xelib.AddElement(shieldOnBackAA, 'Male world model\\MO2S');
        const array2 = xelib.AddElement(shieldOnBackAAClk, 'Male world model\\MO2S');
        xelib.CopyElement(texture, array1);        
        xelib.CopyElement(texture, array2);    
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

    xelib.AddArrayItem(locals.List.keywordBaseShield, 'FormIDs', '', xelib.LongName(record));
    xelib.AddArrayItem(locals.List.keywordBackShield, 'FormIDs', '', xelib.LongName(shieldOnBack));
    xelib.AddArrayItem(locals.List.keywordBackShieldNPC, 'FormIDs', '', xelib.LongName(shieldOnBackNPC));
    xelib.AddArrayItem(locals.List.keywordBackShieldClk, 'FormIDs', '', xelib.LongName(shieldOnBackClk));
    xelib.AddArrayItem(locals.List.keywordBackShieldNPCClk, 'FormIDs', '', xelib.LongName(shieldOnBackNPCClk));
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
            const skyrim = 'Skyrim.esm';
            const master = 'Dual Sheath Redux.esp';

            locals = {
                dataPath: xelib.GetGlobal('DataPath'),
                templateARMA: xelib.GetElement(0, `${master}\\ARMA\\DSR_ARMATemplate`),
                templateARMO: xelib.GetElement(0, `${master}\\ARMO\\DSR_ARMOTemplate`),
                effectDSR: xelib.GetElement(0, `${master}\\MGEF\\DualSheathReduxEffect`),
                keywordArmorShield: xelib.GetElement(0, `${skyrim}\\KYWD\\ArmorShield`),
            }

            locals.List = {
                keywordBaseWeapon: xelib.AddElement(patchFile, 'FLST\\FLST'),
                keywordLeftWeapon: xelib.AddElement(patchFile, 'FLST\\FLST'),
                keywordLeftSheath: xelib.AddElement(patchFile, 'FLST\\FLST'),
                keywordBaseStaff: xelib.AddElement(patchFile, 'FLST\\FLST'),
                keywordRightStaff: xelib.AddElement(patchFile, 'FLST\\FLST'),
                keywordLeftStaff: xelib.AddElement(patchFile, 'FLST\\FLST'),
                keywordBaseShield: xelib.AddElement(patchFile, 'FLST\\FLST'),
                keywordBackShield: xelib.AddElement(patchFile, 'FLST\\FLST'),
                keywordBackShieldNPC: xelib.AddElement(patchFile, 'FLST\\FLST'),
                keywordBackShieldClk: xelib.AddElement(patchFile, 'FLST\\FLST'),
                keywordBackShieldNPCClk: xelib.AddElement(patchFile, 'FLST\\FLST')
            }

            helpers.cacheRecord(locals.List.keywordBaseWeapon, "DSR_BaseWeaponList");
            helpers.cacheRecord(locals.List.keywordLeftWeapon, "DSR_LeftWeaponList");
            helpers.cacheRecord(locals.List.keywordLeftSheath, "DSR_LeftSheathList");
            helpers.cacheRecord(locals.List.keywordBaseStaff, "DSR_BaseStaffList");
            helpers.cacheRecord(locals.List.keywordRightStaff, "DSR_RightStaffList");
            helpers.cacheRecord(locals.List.keywordLeftStaff, "DSR_LeftStaffList");
            helpers.cacheRecord(locals.List.keywordBaseShield, "DSR_BaseShieldList");
            helpers.cacheRecord(locals.List.keywordBackShield, "DSR_BackShieldList");
            helpers.cacheRecord(locals.List.keywordBackShieldNPC, "DSR_BackShieldListNPC");
            helpers.cacheRecord(locals.List.keywordBackShieldClk, "DSR_BackShieldListClk");
            helpers.cacheRecord(locals.List.keywordBackShieldNPCClk, "DSR_BackShieldListNPCClk");

            helpers.logMessage(`DSR: Processing records...`);

            let Added = 0
            
            // Add weapons to list
            const weapons = helpers.loadRecords('WEAP');
            weapons.forEach(record => {
                helpers.addProgress(50/weapons.length);

                if (xelib.EditorID(record) == '')
                    return false;

                const type = xelib.GetValue(record, 'ETYP');
                if ((type == 'BothHands [EQUP:00013F45]') || (type == ''))
                    return;

                const type = xelib.GetValue(record, 'DNAM\\Animation Type');
                switch (type) {
                    case 'OneHandSword':
                    case 'OneHandAxe':
                    case 'OneHandMace':
                    case 'OneHandDagger':
                        AddWeapon(settings, locals, record);
                        break;
                    case 'Staff':
                        AddStaff(settings, locals, record);
                        break;
                    default:
                        return;
                }

                Added += 1;
            });

            helpers.logMessage(`DSR: Added ${Added} weapon records to lists`);
            
            Added = 0
            
            // Add armors to list
            const armors = helpers.loadRecords('ARMO');
            armors.forEach(record => {
                helpers.addProgress(50/armors.length);   

                if (xelib.EditorID(record) == '')
                    return false;

                const flag = xelib.GetRecordFlag(record, 'Shield');
                if (!flag)
                    return;

                const keyword = xelib.HasKeyword(record, locals.keywordArmorShield);
                if (!keyword)
                    return;

                AddShield(settings, locals, record);

                Added += 1;   
            });

            helpers.logMessage(`DSR: Added ${Added} armor records to lists`);

            // Add lists to effect array
            const effect = xelib.CopyElement(locals.effectDSR, patchFile);
            const script = xelib.GetScript(effect, 'DualSheathReduxEffect');
            const property = xelib.AddScriptProperty(script, 'Lists', 'Array of Object', 'Edited');

            const lists = Object.values(locals.List)
            for (const list of lists) {
                let item = xelib.AddArrayItem(property, 'Value\\[0]', 'Object v2\\FormID', xelib.LongName(list)); 
                xelib.SetValue(item, 'Object v2\\Alias', 'None');
            }

            helpers.logMessage(`DSR: Finished`);
        },
        process: []
    })
});