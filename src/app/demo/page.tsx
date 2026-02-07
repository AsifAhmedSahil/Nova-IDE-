'use client'
import { Button } from "@/components/ui/button"


const DemoPage = () => {
    const handleBlocking = async ()=>{
        await fetch("/api/demo/blocking",{method:"POST"})
    }
  return (
    <div className='p-8'>
        <Button  onClick={handleBlocking}>
            Blockcing
        </Button>
    </div>
  )
}

export default DemoPage