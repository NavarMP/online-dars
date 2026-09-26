"use client"

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-heading-3 mb-1">Settings</h1>
        <p className="text-body-sm text-text-muted">Manage global platform settings and configurations.</p>
      </div>

      <div className="bg-canvas border border-hairline rounded-sm p-6 shadow-sm flex flex-col gap-6">
        <div className="border-b border-hairline pb-4">
          <h3 className="text-body font-semibold mb-2">Platform Details</h3>
          <p className="text-body-sm text-text-muted mb-4">Update the general information of the platform.</p>
          
          <div className="grid grid-cols-1 gap-4 max-w-lg">
            <div className="flex flex-col gap-2">
              <label className="text-label text-ink font-[600]">Platform Name</label>
              <input 
                type="text" 
                defaultValue="'ilm Online Dars"
                className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-label text-ink font-[600]">Contact Email</label>
              <input 
                type="email" 
                defaultValue="admin@ilm.com"
                className="bg-field border border-hairline rounded-sm px-3 py-2 text-body-sm outline-none focus:border-ink transition-colors"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-body font-semibold mb-2">Features</h3>
          <div className="flex items-center gap-3 mt-4">
            <input type="checkbox" id="registrations" className="w-4 h-4" defaultChecked />
            <label htmlFor="registrations" className="text-body-sm text-ink">Allow New Student Registrations</label>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <input type="checkbox" id="maintenance" className="w-4 h-4" />
            <label htmlFor="maintenance" className="text-body-sm text-ink">Enable Maintenance Mode</label>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button className="component-button-primary px-6 py-2 h-auto text-body-sm rounded-sm">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
