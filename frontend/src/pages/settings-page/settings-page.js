import React, { useState } from 'react'
import Header from '../../components/ui/header/header';
import Button from '../../components/ui/button/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../shadcn/components/ui/dialog"

const SettingPage = (props) => {
  const { user, setUser, email, loggedIn, setLoggedIn } = props
  const text = "Add profile picture";
  const handleAddPFP = () => {

  }
  return (
    <div>
      <Header user={user} setUser={setUser} />
      <div className="mt-15 pt-20">
        Settings
      </div>
      <Dialog>
        <button className="p-[3px] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
            <DialogTrigger>Add Profile Picture</DialogTrigger>
          </div>
        </button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SettingPage;