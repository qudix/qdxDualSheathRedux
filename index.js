/* global ngapp, xelib, registerPatcher, patcherUrl */

let isOf = function(array, item) {
    let is = false;

    array.forEach(arr => {
        if (arr == item)
            is = true;
    });

    return is;
}

let GetBodyTemplate = function(record) {
    return xelib.GetElement(record, 'BODT') || xelib.GetElement(record, 'BOD2');
};

let GetFileRecord = function(handle, formId) {
    const loadOrder = xelib.GetFileLoadOrder(handle);
    return xelib.GetRecord(handle, (loadOrder << 24) | formId);
}

let CheckIfUsable = function(record, type = 0) {
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

let AddWEAP = function(patchFile, helpers, settings, locals, record) {
    let weapEDID = xelib.GetValue(record, 'EDID - Editor ID');

    let model = xelib.GetValue(record, 'MODL\\MODL');
    let periodIndex = model.lastIndexOf('.');

    let weaponModel = model.substring(0, periodIndex) + 'Left' + model.substring(periodIndex);
    let sheathModel = model.substring(0, periodIndex) + 'Sheath' + model.substring(periodIndex);

    let leftWeaponAA = xelib.CopyElement(locals.ARMATemplate, patchFile, true);
    xelib.SetValue(leftWeaponAA, 'EDID - Editor ID', 'DSR_W_' + weapEDID + 'AA');
    xelib.AddElementValue(leftWeaponAA, 'Male world model\\MOD2', weaponModel);    
    xelib.SetFlag(leftWeaponAA, 'BOD2 - Biped Body Template\\First Person Flags', settings.leftBipedSlot, true);

    let leftSheathAA = xelib.CopyElement(locals.ARMATemplate, patchFile, true);
    xelib.SetValue(leftSheathAA, 'EDID - Editor ID', 'DSR_S_' + weapEDID + 'AA');
    xelib.AddElementValue(leftSheathAA, 'Male world model\\MOD2', sheathModel);    
    xelib.SetFlag(leftSheathAA, 'BOD2 - Biped Body Template\\First Person Flags', settings.leftBipedSlot, true);

    let leftWeapon = xelib.CopyElement(locals.ARMOTemplate, patchFile, true);
    xelib.SetValue(leftWeapon, 'EDID - Editor ID', 'DSR_W_' + weapEDID);
    xelib.AddElementValue(leftWeapon, 'Armature\\[0]', xelib.LongName(leftWeaponAA));    
    xelib.SetFlag(leftWeapon, 'BOD2 - Biped Body Template\\First Person Flags', settings.leftBipedSlot, true);

    let leftSheath = xelib.CopyElement(locals.ARMOTemplate, patchFile, true);
    xelib.SetValue(leftSheath, 'EDID - Editor ID', 'DSR_S_' + weapEDID);
    xelib.AddElementValue(leftSheath, 'Armature\\[0]', xelib.LongName(leftSheathAA));    
    xelib.SetFlag(leftSheath, 'BOD2 - Biped Body Template\\First Person Flags', settings.leftBipedSlot, true);

    // TODO: Requiem Support?

    xelib.AddArrayItem(locals.BaseWeaponList, 'FormIDs', '', xelib.LongName(record));
    xelib.AddArrayItem(locals.LeftWeaponList, 'FormIDs', '', xelib.LongName(leftWeapon));
    xelib.AddArrayItem(locals.LeftSheathList, 'FormIDs', '', xelib.LongName(leftSheath));
}

let AddSTAF = function(patchFile, helpers, settings, locals, record) {
    let staffEDID = xelib.GetValue(record, 'EDID - Editor ID');

    let model = xelib.GetValue(record, 'MODL\\MODL');
    let periodIndex = model.lastIndexOf('.');

    let leftModel = model.substring(0, periodIndex) + 'Left' + model.substring(periodIndex);
    let rightModel = model.substring(0, periodIndex) + 'Right' + model.substring(periodIndex);

    let leftStaffAA = xelib.CopyElement(locals.ARMATemplate, patchFile, true);
    xelib.SetValue(leftStaffAA, 'EDID - Editor ID', 'DSR_LS_' + staffEDID + 'AA');
    xelib.AddElementValue(leftStaffAA, 'Male world model\\MOD2', leftModel);    
    xelib.SetFlag(leftStaffAA, 'BOD2 - Biped Body Template\\First Person Flags', settings.leftBipedSlot, true);

    let rightStaffAA = xelib.CopyElement(locals.ARMATemplate, patchFile, true);
    xelib.SetValue(rightStaffAA, 'EDID - Editor ID', 'DSR_RS_' + staffEDID + 'AA');
    xelib.AddElementValue(rightStaffAA, 'Male world model\\MOD2', rightModel);    
    xelib.SetFlag(rightStaffAA, 'BOD2 - Biped Body Template\\First Person Flags', settings.rightBipedSlot, true); 

    let leftStaff = xelib.CopyElement(locals.ARMOTemplate, patchFile, true);
    xelib.SetValue(leftStaff, 'EDID - Editor ID', 'DSR_LS_' + staffEDID);
    xelib.AddElementValue(leftStaff, 'Armature\\[0]', xelib.LongName(leftStaffAA));    
    xelib.SetFlag(leftStaff, 'BOD2 - Biped Body Template\\First Person Flags', settings.leftBipedSlot, true);

    let rightStaff = xelib.CopyElement(locals.ARMOTemplate, patchFile, true);
    xelib.SetValue(rightStaff, 'EDID - Editor ID', 'DSR_RS_' + staffEDID);
    xelib.AddElementValue(rightStaff, 'Armature\\[0]', xelib.LongName(rightStaffAA));    
    xelib.SetFlag(rightStaff, 'BOD2 - Biped Body Template\\First Person Flags', settings.rightBipedSlot, true);

    // TODO: Requiem Support?

    xelib.AddArrayItem(locals.BaseStaffList, 'FormIDs', '', xelib.LongName(record));
    xelib.AddArrayItem(locals.LeftStaffList, 'FormIDs', '', xelib.LongName(leftStaff));
    xelib.AddArrayItem(locals.RightStaffList, 'FormIDs', '', xelib.LongName(rightStaff));
}

let AddSHLD = function(patchFile, helpers, settings, locals, record) {
    let shieldEDID = xelib.GetValue(record, 'EDID - Editor ID');

    let model = xelib.GetValue(record, 'Male world model\\MOD2');
    let periodIndex = model.lastIndexOf('.');

    let shieldModel = model.substring(0, periodIndex) + 'OnBack';
    let shieldModelClk = shieldModel + 'Clk' + model.substring(periodIndex);

    shieldModel = shieldModel + model.substring(periodIndex);

    let shieldOnBackAA = xelib.CopyElement(locals.ARMATemplate, patchFile, true);
    xelib.SetValue(shieldOnBackAA, 'EDID - Editor ID', 'DSR_SB_' + shieldEDID + 'AA');
    xelib.AddElementValue(shieldOnBackAA, 'Male world model\\MOD2', shieldModel);      
    xelib.SetFlag(shieldOnBackAA, 'BOD2 - Biped Body Template\\First Person Flags', settings.leftBipedSlot, true);
    xelib.SetFlag(shieldOnBackAA, 'BOD2 - Biped Body Template\\First Person Flags', '39 - Shield', true);
    
    let shieldOnBackAAClk = xelib.CopyElement(locals.ARMATemplate, patchFile, true);
    xelib.AddElementValue(shieldOnBackAAClk, 'Male world model\\MOD2', shieldModelClk);  
    xelib.SetValue(shieldOnBackAAClk, 'EDID - Editor ID', 'DSR_SBC_' + shieldEDID + 'AA');
    xelib.SetFlag(shieldOnBackAAClk, 'BOD2 - Biped Body Template\\First Person Flags', settings.leftBipedSlot, true);
    xelib.SetFlag(shieldOnBackAAClk, 'BOD2 - Biped Body Template\\First Person Flags', '39 - Shield', true);

    let shieldOnBack = xelib.CopyElement(locals.ARMOTemplate, patchFile, true);
    xelib.AddElementValue(shieldOnBack, 'Armature\\[0]', xelib.LongName(shieldOnBackAA));    
    xelib.SetValue(shieldOnBack, 'EDID - Editor ID', 'DSR_SB_' + shieldEDID);
    xelib.SetFlag(shieldOnBack, 'BOD2 - Biped Body Template\\First Person Flags', settings.leftBipedSlot, true);

    let shieldOnBackNPC = xelib.CopyElement(locals.ARMOTemplate, patchFile, true);
    xelib.AddElementValue(shieldOnBackNPC, 'Armature\\[0]', xelib.LongName(shieldOnBackAA));    
    xelib.SetValue(shieldOnBackNPC, 'EDID - Editor ID', 'DSR_SBN_' + shieldEDID);
    xelib.SetFlag(shieldOnBackNPC, 'BOD2 - Biped Body Template\\First Person Flags', settings.leftBipedSlot, true);

    let shieldOnBackClk = xelib.CopyElement(locals.ARMOTemplate, patchFile, true);
    xelib.AddElementValue(shieldOnBackClk, 'Armature\\[0]', xelib.LongName(shieldOnBackAAClk));    
    xelib.SetValue(shieldOnBackClk, 'EDID - Editor ID', 'DSR_SBC_' + shieldEDID);
    xelib.SetFlag(shieldOnBackClk, 'BOD2 - Biped Body Template\\First Person Flags', settings.leftBipedSlot, true);

    let shieldOnBackNPCClk = xelib.CopyElement(locals.ARMOTemplate, patchFile, true);
    xelib.AddElementValue(shieldOnBackNPCClk, 'Armature\\[0]', xelib.LongName(shieldOnBackAAClk));    
    xelib.SetValue(shieldOnBackNPCClk, 'EDID - Editor ID', 'DSR_SBNC_' + shieldEDID);
    xelib.SetFlag(shieldOnBackNPCClk, 'BOD2 - Biped Body Template\\First Person Flags', settings.leftBipedSlot, true);

    // TODO: Requiem Support?

    xelib.AddArrayItem(locals.BaseShieldList, 'FormIDs', '', xelib.LongName(record));
    xelib.AddArrayItem(locals.BackShieldList, 'FormIDs', '', xelib.LongName(shieldOnBack));
    xelib.AddArrayItem(locals.BackShieldListNPC, 'FormIDs', '', xelib.LongName(shieldOnBackNPC));
    xelib.AddArrayItem(locals.BackShieldListClk, 'FormIDs', '', xelib.LongName(shieldOnBackClk));
    xelib.AddArrayItem(locals.BackShieldListNPCClk, 'FormIDs', '', xelib.LongName(shieldOnBackNPCClk));
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
        initialize: function() {
            let handle = xelib.FileByName('Dual Sheath Redux.esp');

            locals.WEAPList = helpers.loadRecords('WEAP');
            locals.SHLDList = helpers.loadRecords('ARMO');
            
            locals.ARMATemplate = GetFileRecord(handle, '0x005369');
            locals.ARMOTemplate = GetFileRecord(handle, '0x004E06');

            locals.DSREffect = GetFileRecord(handle, '0x00182C');

            locals.BaseWeaponList = xelib.AddElement(patchFile, 'FLST\\FLST');
            locals.LeftWeaponList = xelib.AddElement(patchFile, 'FLST\\FLST');
            locals.LeftSheathList = xelib.AddElement(patchFile, 'FLST\\FLST');
            locals.BaseStaffList = xelib.AddElement(patchFile, 'FLST\\FLST');
            locals.RightStaffList = xelib.AddElement(patchFile, 'FLST\\FLST');
            locals.LeftStaffList = xelib.AddElement(patchFile, 'FLST\\FLST');
            locals.BaseShieldList = xelib.AddElement(patchFile, 'FLST\\FLST');
            locals.BackShieldList = xelib.AddElement(patchFile, 'FLST\\FLST');
            locals.BackShieldListNPC = xelib.AddElement(patchFile, 'FLST\\FLST');
            locals.BackShieldListClk = xelib.AddElement(patchFile, 'FLST\\FLST');
            locals.BackShieldListNPCClk = xelib.AddElement(patchFile, 'FLST\\FLST');

            helpers.cacheRecord(locals.BaseWeaponList, "DSR_BaseWeaponList");
            helpers.cacheRecord(locals.LeftWeaponList, "DSR_LeftWeaponList");
            helpers.cacheRecord(locals.LeftSheathList, "DSR_LeftSheathList");
            helpers.cacheRecord(locals.BaseStaffList, "DSR_BaseStaffList");
            helpers.cacheRecord(locals.RightStaffList, "DSR_RightStaffList");
            helpers.cacheRecord(locals.LeftStaffList, "DSR_LeftStaffList");
            helpers.cacheRecord(locals.BaseShieldList, "DSR_BaseShieldList");
            helpers.cacheRecord(locals.BackShieldList, "DSR_BackShieldList");
            helpers.cacheRecord(locals.BackShieldListNPC, "DSR_BackShieldListNPC");
            helpers.cacheRecord(locals.BackShieldListClk, "DSR_BackShieldListClk");
            helpers.cacheRecord(locals.BackShieldListNPCClk, "DSR_BackShieldListNPCClk");   

            helpers.logMessage(`DSR: WEAP Records - ${locals.WEAPList.length}`);

            let weapPatched = 0, 
                weapSkipped = 0,
                shldPatched = 0,
                shldSkipped = 0;
            
            locals.WEAPList.forEach(record => {
                if (CheckIfUsable(record, 0)) {
                    let weapType = xelib.GetValue(record, 'DNAM\\Animation Type');

                    if (isOf(['OneHandSword', 'OneHandAxe', 'OneHandMace', 'OneHandDagger'], weapType)) {
                        AddWEAP(patchFile, helpers, settings, locals, record);
                        weapPatched += 1;
                    } 
                    else if (isOf(['Staff'], weapType)) {
                        AddSTAF(patchFile, helpers, settings, locals, record);
                        weapPatched += 1;
                    } 
                    else
                        weapSkipped += 1;
                } 
                else
                    weapSkipped += 1;

                helpers.addProgress(49.5/locals.WEAPList.length);
            })

            helpers.logMessage(`DSR: WEAP Patched Records - ${weapPatched}`);
            helpers.logMessage(`DSR: WEAP Skipped Records - ${weapSkipped}`);

            helpers.logMessage(`DSR: SHLD Records - ${locals.SHLDList.length}`);

            locals.SHLDList.forEach(record => {
                if (CheckIfUsable(record, 1)) {
                    let shldFlag = xelib.GetFlag(GetBodyTemplate(record), 'First Person Flags', '39 - Shield');
                    let shldKeyword = xelib.HasKeyword(record, 'ArmorShield');

                    if (shldFlag && shldKeyword) {
                        AddSHLD(patchFile, helpers, settings, locals, record);
                        shldPatched += 1;
                    }
                    else
                        shldSkipped += 1;
                }
                else
                    shldSkipped += 1;

                helpers.addProgress(49.5/locals.SHLDList.length);
            })

            helpers.logMessage(`DSR: SHLD Patched Records - ${shldPatched}`);
            helpers.logMessage(`DSR: SHLD Skipped Records - ${shldSkipped}`);
            
            let DSREffect = xelib.CopyElement(locals.DSREffect, patchFile);
            let DSRScript = xelib.GetScript(DSREffect, 'DualSheathReduxEffect');
            let DSRProperty = xelib.AddScriptProperty(DSRScript, 'Lists', 'Array of Object', 'Edited');

            let Item01 = xelib.AddArrayItem(DSRProperty, 'Value\\[0]', 'Object v2\\FormID', xelib.LongName(locals.BaseWeaponList));
            xelib.SetValue(Item01, 'Object v2\\Alias', 'None');
            let Item02 = xelib.AddArrayItem(DSRProperty, 'Value\\[0]', 'Object v2\\FormID', xelib.LongName(locals.LeftWeaponList));
            xelib.SetValue(Item02, 'Object v2\\Alias', 'None');
            let Item03 = xelib.AddArrayItem(DSRProperty, 'Value\\[0]', 'Object v2\\FormID', xelib.LongName(locals.LeftSheathList));
            xelib.SetValue(Item03, 'Object v2\\Alias', 'None');
            let Item04 = xelib.AddArrayItem(DSRProperty, 'Value\\[0]', 'Object v2\\FormID', xelib.LongName(locals.BaseStaffList));
            xelib.SetValue(Item04, 'Object v2\\Alias', 'None');
            let Item05 = xelib.AddArrayItem(DSRProperty, 'Value\\[0]', 'Object v2\\FormID', xelib.LongName(locals.RightStaffList));
            xelib.SetValue(Item05, 'Object v2\\Alias', 'None');
            let Item06 = xelib.AddArrayItem(DSRProperty, 'Value\\[0]', 'Object v2\\FormID', xelib.LongName(locals.LeftStaffList));
            xelib.SetValue(Item06, 'Object v2\\Alias', 'None');
            let Item07 = xelib.AddArrayItem(DSRProperty, 'Value\\[0]', 'Object v2\\FormID', xelib.LongName(locals.BaseShieldList));
            xelib.SetValue(Item07, 'Object v2\\Alias', 'None');
            let Item08 = xelib.AddArrayItem(DSRProperty, 'Value\\[0]', 'Object v2\\FormID', xelib.LongName(locals.BackShieldList));
            xelib.SetValue(Item08, 'Object v2\\Alias', 'None');
            let Item09 = xelib.AddArrayItem(DSRProperty, 'Value\\[0]', 'Object v2\\FormID', xelib.LongName(locals.BackShieldListNPC));
            xelib.SetValue(Item09, 'Object v2\\Alias', 'None');
            let Item10 = xelib.AddArrayItem(DSRProperty, 'Value\\[0]', 'Object v2\\FormID', xelib.LongName(locals.BackShieldListClk));
            xelib.SetValue(Item10, 'Object v2\\Alias', 'None');
            let Item11 = xelib.AddArrayItem(DSRProperty, 'Value\\[0]', 'Object v2\\FormID', xelib.LongName(locals.BackShieldListNPCClk));
            xelib.SetValue(Item11, 'Object v2\\Alias', 'None');
        },
        process: []
    })
});