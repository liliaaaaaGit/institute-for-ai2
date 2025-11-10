import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

        // Close modal
        setIsLeadModalOpen(false)
        // Clear pending data
        setPendingFormData(null)
      }
    } catch (error) {
      console.error('Error in handleReportConfirmed:', error)
      alert('Failed to process calculation. Please try again.')
  } catch (error) {
    console.error('Failed to render app:', error)
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; background: #fee; border: 1px solid #f00;">
        <h1>Render Error</h1>
        <p>Failed to render the React application.</p>
        <pre>${error}</pre>
        <button onclick="window.location.reload()">Reload Page</button>
      </div>
    `
  }
}