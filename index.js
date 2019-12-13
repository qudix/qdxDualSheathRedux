
function GetBodyTemplate(record) {
    return xelib.GetElement(record, 'BODT') || xelib.GetElement(record, 'BOD2');
};

function IsUsable(record, type = 0) {
    if (xelib.EditorID(record) == '')
        return false;

    if (xelib.GetRecordFlag(record, 'Non-Playable'))
        return false;

    if (type == 0) {
        if (xelib.GetValue(record, 'MODL\\MODL') == '')
            return false;

        if (!xelib.GetValue(record, 'MODL\\MODL').toLowerCase().includes('.nif'))
            return false;

        if (xelib.GetFlag(record, 'DNAM\\Flags', 'Non-playable'))
            return false;
    }
    else if (type == 1) {
        if (xelib.GetValue(record, 'MOD2\\MOD2') == '')
            return false;

        if (!xelib.GetValue(record, 'MOD2\\MOD2').toLowerCase().includes('.nif'))
            return false;
    }
    
    return true;
}

function AddWeapon(patchFile, settings, locals, record) {
    const id = xelib.GetValue(record, 'EDID - Editor ID');

    const model = xelib.GetValue(record, 'MODL\\MODL');
    const index = model.lastIndexOf('.');

    const weaponModel = model.substring(0, index) + 'Left' + model.substring(index);
    const sheathModel = model.substring(0, index) + 'Sheath' + model.substring(index);

    // Addons
    const leftWeaponAA = xelib.CopyElement(locals.TemplateARMA, patchFile, true);
    xelib.SetValue(leftWeaponAA, 'EDID - Editor ID', 'DSR_W_' + id + 'AA');
    xelib.AddElementValue(leftWeaponAA, 'Male world model\\MOD2', weaponModel);    
    xelib.SetFlag(leftWeaponAA, 'BOD2 - Biped Body Template\\First Person Flags', settings.leftBipedSlot, true);

    const leftSheathAA = xelib.CopyElement(leftWeaponAA, patchFile, true);
    xelib.SetValue(leftSheathAA, 'EDID - Editor ID', 'DSR_S_' + id + 'AA');
    xelib.AddElementValue(leftSheathAA, 'Male world model\\MOD2', sheathModel);    

    // Armor
    const leftWeapon = xelib.CopyElement(locals.TemplateARMO, patchFile, true);
    xelib.SetValue(leftWeapon, 'EDID - Editor ID', 'DSR_W_' + id);
    xelib.AddElementValue(leftWeapon, 'Armature\\[0]', xelib.LongName(leftWeaponAA));    
    xelib.SetFlag(leftWeapon, 'BOD2 - Biped Body Template\\First Person Flags', settings.leftBipedSlot, true);

    const leftSheath = xelib.CopyElement(leftWeapon, patchFile, true);
    xelib.SetValue(leftSheath, 'EDID - Editor ID', 'DSR_S_' + id);
    xelib.AddElementValue(leftSheath, 'Armature\\[0]', xelib.LongName(leftSheathAA));    
    
    // TODO: Requiem Support?

    xelib.AddArrayItem(locals.List.BaseWeapon, 'FormIDs', '', xelib.LongName(record));
    xelib.AddArrayItem(locals.List.LeftWeapon, 'FormIDs', '', xelib.LongName(leftWeapon));
    xelib.AddArrayItem(locals.List.LeftSheath, 'FormIDs', '', xelib.LongName(leftSheath));
}

function AddStaff(patchFile, settings, locals, record) {
    const id = xelib.GetValue(record, 'EDID - Editor ID');

    const model = xelib.GetValue(record, 'MODL\\MODL');
    const index = model.lastIndexOf('.');

    const modelLeft = model.substring(0, index) + 'Left' + model.substring(index);
    const modelRight = model.substring(0, index) + 'Right' + model.substring(index);

    // Addons
    const leftStaffAA = xelib.CopyElement(locals.TemplateARMA, patchFile, true);
    xelib.SetValue(leftStaffAA, 'EDID - Editor ID', 'DSR_LS_' + id + 'AA');
    xelib.AddElementValue(leftStaffAA, 'Male world model\\MOD2', modelLeft);    
    xelib.SetFlag(leftStaffAA, 'BOD2 - Biped Body Template\\First Person Flags', settings.leftBipedSlot, true);

    const rightStaffAA = xelib.CopyElement(locals.TemplateARMA, patchFile, true);
    xelib.SetValue(rightStaffAA, 'EDID - Editor ID', 'DSR_RS_' + id + 'AA');
    xelib.AddElementValue(rightStaffAA, 'Male world model\\MOD2', modelRight);    
    xelib.SetFlag(rightStaffAA, 'BOD2 - Biped Body Template\\First Person Flags', settings.rightBipedSlot, true); 

    // Armor
    const leftStaff = xelib.CopyElement(locals.TemplateARMO, patchFile, true);
    xelib.SetValue(leftStaff, 'EDID - Editor ID', 'DSR_LS_' + id);
    xelib.AddElementValue(leftStaff, 'Armature\\[0]', xelib.LongName(leftStaffAA));    
    xelib.SetFlag(leftStaff, 'BOD2 - Biped Body Template\\First Person Flags', settings.leftBipedSlot, true);

    const rightStaff = xelib.CopyElement(locals.TemplateARMO, patchFile, true);
    xelib.SetValue(rightStaff, 'EDID - Editor ID', 'DSR_RS_' + id);
    xelib.AddElementValue(rightStaff, 'Armature\\[0]', xelib.LongName(rightStaffAA));    
    xelib.SetFlag(rightStaff, 'BOD2 - Biped Body Template\\First Person Flags', settings.rightBipedSlot, true);

    // TODO: Requiem Support?

    xelib.AddArrayItem(locals.List.BaseStaff, 'FormIDs', '', xelib.LongName(record));
    xelib.AddArrayItem(locals.List.LeftStaff, 'FormIDs', '', xelib.LongName(leftStaff));
    xelib.AddArrayItem(locals.List.RightStaff, 'FormIDs', '', xelib.LongName(rightStaff));
}

function AddShield(patchFile, settings, locals, record) {
    const id = xelib.GetValue(record, 'EDID - Editor ID');

    const model = xelib.GetValue(record, 'Male world model\\MOD2');
    const index = model.lastIndexOf('.');

    let newModel = model.substring(0, index) + 'OnBack';
    const newModelClk = newModel + 'Clk' + model.substring(index);

    newModel += model.substring(index);

    // Addons
    const shieldOnBackAA = xelib.CopyElement(locals.TemplateARMA, patchFile, true);
    xelib.SetValue(shieldOnBackAA, 'EDID - Editor ID', 'DSR_SB_' + id + 'AA');
    xelib.AddElementValue(shieldOnBackAA, 'Male world model\\MOD2', newModel);   
    xelib.SetFlag(shieldOnBackAA, 'BOD2 - Biped Body Template\\First Person Flags', settings.leftBipedSlot, true);
    xelib.SetFlag(shieldOnBackAA, 'BOD2 - Biped Body Template\\First Person Flags', '39 - Shield', true);
    
    const shieldOnBackAAClk = xelib.CopyElement(shieldOnBackAA, patchFile, true);
    xelib.SetValue(shieldOnBackAAClk, 'EDID - Editor ID', 'DSR_SBC_' + id + 'AA');
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
    const shieldOnBack = xelib.CopyElement(locals.TemplateARMO, patchFile, true); 
    xelib.SetValue(shieldOnBack, 'EDID - Editor ID', 'DSR_SB_' + id);
    xelib.SetFlag(shieldOnBack, 'BOD2 - Biped Body Template\\First Person Flags', settings.leftBipedSlot, true);
    xelib.AddElementValue(shieldOnBack, 'Armature\\[0]', xelib.LongName(shieldOnBackAA));   

    const shieldOnBackNPC = xelib.CopyElement(shieldOnBack, patchFile, true);
    xelib.SetValue(shieldOnBackNPC, 'EDID - Editor ID', 'DSR_SBN_' + id);
    xelib.SetFlag(shieldOnBackNPC, 'BOD2 - Biped Body Template\\First Person Flags', '39 - Shield', true);

    const shieldOnBackClk = xelib.CopyElement(shieldOnBack, patchFile, true);   
    xelib.SetValue(shieldOnBackClk, 'EDID - Editor ID', 'DSR_SBC_' + id);
    xelib.AddElementValue(shieldOnBackClk, 'Armature\\[0]', xelib.LongName(shieldOnBackAAClk)); 

    const shieldOnBackNPCClk = xelib.CopyElement(shieldOnBackClk, patchFile, true);
    xelib.SetValue(shieldOnBackNPCClk, 'EDID - Editor ID', 'DSR_SBNC_' + id);
    xelib.SetFlag(shieldOnBackNPCClk, 'BOD2 - Biped Body Template\\First Person Flags', '39 - Shield', true);

    // TODO: Requiem Support?

    xelib.AddArrayItem(locals.List.BaseShield, 'FormIDs', '', xelib.LongName(record));
    xelib.AddArrayItem(locals.List.BackShield, 'FormIDs', '', xelib.LongName(shieldOnBack));
    xelib.AddArrayItem(locals.List.BackShieldNPC, 'FormIDs', '', xelib.LongName(shieldOnBackNPC));
    xelib.AddArrayItem(locals.List.BackShieldClk, 'FormIDs', '', xelib.LongName(shieldOnBackClk));
    xelib.AddArrayItem(locals.List.BackShieldNPCClk, 'FormIDs', '', xelib.LongName(shieldOnBackNPCClk));
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
            const master = 'Dual Sheath Redux.esp';

            const weapons = helpers.loadRecords('WEAP');
            const armors = helpers.loadRecords('ARMO');

            locals = {
                TemplateARMA: xelib.GetElement(0, `${master}\\ARMA\\DSR_ARMATemplate`),
                TemplateARMO: xelib.GetElement(0, `${master}\\ARMO\\DSR_ARMOTemplate`),
                EffectDSR: xelib.GetElement(0, `${master}\\MGEF\\DualSheathReduxEffect`),
                Added: 0
            }

            locals.List = {
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
                BackShieldNPCClk: xelib.AddElement(patchFile, 'FLST\\FLST'),
            }

            helpers.cacheRecord(locals.List.BaseWeapon, "DSR_BaseWeaponList");
            helpers.cacheRecord(locals.List.LeftWeapon, "DSR_LeftWeaponList");
            helpers.cacheRecord(locals.List.LeftSheath, "DSR_LeftSheathList");
            helpers.cacheRecord(locals.List.BaseStaff, "DSR_BaseStaffList");
            helpers.cacheRecord(locals.List.RightStaff, "DSR_RightStaffList");
            helpers.cacheRecord(locals.List.LeftStaff, "DSR_LeftStaffList");
            helpers.cacheRecord(locals.List.BaseShield, "DSR_BaseShieldList");
            helpers.cacheRecord(locals.List.BackShield, "DSR_BackShieldList");
            helpers.cacheRecord(locals.List.BackShieldNPC, "DSR_BackShieldListNPC");
            helpers.cacheRecord(locals.List.BackShieldClk, "DSR_BackShieldListClk");
            helpers.cacheRecord(locals.List.BackShieldNPCClk, "DSR_BackShieldListNPCClk");

            helpers.logMessage(`DSR: Processing records...`);
            
            // Add weapons to list
            weapons.forEach(record => {
                helpers.addProgress(50/weapons.length);

                if (!IsUsable(record))
                    return;

                const type = xelib.GetValue(record, 'DNAM\\Animation Type');

                switch (type) {
                    case 'OneHandSword':
                    case 'OneHandAxe':
                    case 'OneHandMace':
                    case 'OneHandDagger':
                        AddWeapon(patchFile, settings, locals, record);
                        break;
                    case 'Staff':
                        AddStaff(patchFile, settings, locals, record);
                        break;
                    default:
                        return;
                }

                locals.Added += 1;
            });

            helpers.logMessage(`DSR: Added ${locals.Added} weapon records to lists`);

            locals.Added = 0
            
            // Add armors to list
            armors.forEach(record => {
                helpers.addProgress(50/armors.length);   

                if (!IsUsable(record, 1))
                    return;

                const flag = xelib.GetFlag(GetBodyTemplate(record), 'First Person Flags', '39 - Shield');
                if (!flag)
                    return;

                const keyword = xelib.HasKeyword(record, 'ArmorShield');
                if (!keyword)
                    return;

                AddShield(patchFile, settings, locals, record);

                locals.Added += 1;   
            });

            helpers.logMessage(`DSR: Added ${locals.Added} armor records to lists`);

            // Add lists to effect array
            const effect = xelib.CopyElement(locals.EffectDSR, patchFile);
            const script = xelib.GetScript(effect, 'DualSheathReduxEffect');
            const property = xelib.AddScriptProperty(script, 'Lists', 'Array of Object', 'Edited');

            const lists = Object.values(locals.List)
            for (const list of lists) {
                xelib.AddArrayItem(property, 'Value\\[0]', 'Object v2\\FormID', xelib.LongName(list));
            }

            helpers.logMessage(`DSR: Finished`);
        },
        process: []
    })
});