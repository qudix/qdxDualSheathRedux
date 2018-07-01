/* global ngapp, xelib */

let isOf = function(array, item) {
    let found = false;
    array.forEach(arr => {
        if (arr == item)
            found = true;
    });
    return found;
}

let GetFileRecord = function(handle, formId) {
    const loadOrder = xelib.GetFileLoadOrder(handle);
    return xelib.GetRecord(handle, (loadOrder << 24) | formId);
}

let AddWEAP = function(patchFile, helpers, locals, record) {

    if (xelib.EditorID(record) == '')
        return false;

    if (xelib.GetValue(record, 'MODL\\MODL') == '')
        return false;

    if (!xelib.GetValue(record, 'MODL\\MODL').toLowerCase().includes('.nif'))
        return false;

    if (xelib.GetRecordFlag(record, 'Non-Playable'))
        return false;

    if (xelib.GetFlag(record, 'DNAM\\Flags', 'Non-playable'))
        return false;

    let weapType = xelib.GetValue(record, 'DNAM\\Animation Type');

    if (isOf(['OneHandSword', 'OneHandAxe', 'OneHandMace', 'OneHandDagger'], weapType)) {
        let weapEDID = xelib.GetValue(record, 'EDID - Editor ID');

        let model = xelib.GetValue(record, 'MODL\\MODL');
        let periodIndex = model.lastIndexOf('.');

        let weaponModel = model.substring(0, periodIndex) + 'Left' + model.substring(periodIndex);
        let sheathModel = model.substring(0, periodIndex) + 'Sheath' + model.substring(periodIndex);

        // TODO: Set First Person Flags slot using a modal setting instead

        let leftWeaponAA = xelib.CopyElement(locals.ARMATemplate, patchFile, true);
        xelib.SetValue(leftWeaponAA, 'EDID - Editor ID', 'DSR_W_' + weapEDID + 'AA');
        xelib.SetFlag(leftWeaponAA, 'BOD2 - Biped Body Template\\First Person Flags', '60 - Unnamed', true);
        xelib.AddElementValue(leftWeaponAA, 'Male world model\\MOD2', weaponModel);

        let leftSheathAA = xelib.CopyElement(locals.ARMATemplate, patchFile, true);
        xelib.SetValue(leftSheathAA, 'EDID - Editor ID', 'DSR_S_' + weapEDID + 'AA');
        xelib.SetFlag(leftSheathAA, 'BOD2 - Biped Body Template\\First Person Flags', '60 - Unnamed', true);
        xelib.AddElementValue(leftSheathAA, 'Male world model\\MOD2', sheathModel);

        let leftWeapon = xelib.CopyElement(locals.ARMOTemplate, patchFile, true);
        xelib.SetValue(leftWeapon, 'EDID - Editor ID', 'DSR_W_' + weapEDID);
        xelib.SetFlag(leftWeapon, 'BOD2 - Biped Body Template\\First Person Flags', '60 - Unnamed', true);
        xelib.AddElementValue(leftWeapon, 'Armature\\[0]', xelib.LongName(leftWeaponAA));

        let leftSheath = xelib.CopyElement(locals.ARMOTemplate, patchFile, true);
        xelib.SetValue(leftSheath, 'EDID - Editor ID', 'DSR_S_' + weapEDID);
        xelib.SetFlag(leftSheath, 'BOD2 - Biped Body Template\\First Person Flags', '60 - Unnamed', true);
        xelib.AddElementValue(leftSheath, 'Armature\\[0]', xelib.LongName(leftSheathAA));

        xelib.AddArrayItem(locals.BaseWeaponList, 'FormIDs', '', xelib.LongName(record));
        xelib.AddArrayItem(locals.LeftWeaponList, 'FormIDs', '', xelib.LongName(leftWeapon));
        xelib.AddArrayItem(locals.LeftSheathList, 'FormIDs', '', xelib.LongName(leftSheath));

        return true;
    } 
    /*else if (isOf(['Staff'], weapType)) {
        // TODO: Staff's
    }*/

    return false;
}

let AddSHLD = function(patchFile, helpers, locals, record) {
    // TODO: Shields

    return false;
}

registerPatcher({
    info: info,
    gameModes: [xelib.gmTES5, xelib.gmSSE],
    settings: {
        label: 'Dual Sheath Redux',
        hide: true
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

            let patched = 0, 
                skipped = 0;
            
            locals.WEAPList.forEach(record => {
                let result = AddWEAP(patchFile, helpers, locals, record);
                
                if (result)
                    patched += 1;
                else
                    skipped += 1;

                helpers.addProgress(99/locals.WEAPList.length);
            })

            helpers.logMessage(`DSR: Patched Records - ${patched}`);
            helpers.logMessage(`DSR: Skipped Records - ${skipped}`);
            
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