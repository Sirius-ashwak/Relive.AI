import React from 'react'
import { FixedSizeGrid as Grid } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { motion } from 'framer-motion'
import { usePersonaStore } from '../../store/personaStore'
import { Persona } from '../../types'
import PersonaCard from '../PersonaCard'

interface VirtualizedPersonaGridProps {
  onStartChat: (persona: Persona) => void
  onCreateMemory: () => void
}

const CARD_WIDTH = 320
const CARD_HEIGHT = 280
const PADDING = 24

const VirtualizedPersonaGrid: React.FC<VirtualizedPersonaGridProps> = ({
  onStartChat,
  onCreateMemory
}) => {
  const { personas } = usePersonaStore()

  const Cell = ({ columnIndex, rowIndex, style }: any) => {
    const itemIndex = rowIndex * Math.floor((window.innerWidth - PADDING * 2) / (CARD_WIDTH + PADDING)) + columnIndex
    const persona = personas[itemIndex]

    if (!persona) return null

    return (
      <div style={style}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: itemIndex * 0.1 }}
          className="p-3"
        >
          <PersonaCard
            name={persona.name}
            type={persona.type}
            lastInteraction={`${Math.floor((Date.now() - persona.lastInteraction.getTime()) / (1000 * 60 * 60 * 24))} days ago`}
            avatar={persona.avatar}
            status={persona.status}
            onClick={() => onStartChat(persona)}
          />
        </motion.div>
      </div>
    )
  }

  const getColumnCount = (width: number) => {
    return Math.floor((width - PADDING * 2) / (CARD_WIDTH + PADDING))
  }

  const getRowCount = (columnCount: number) => {
    return Math.ceil(personas.length / columnCount)
  }

  return (
    <div className="h-[600px] w-full">
      <AutoSizer>
        {({ height, width }) => {
          const columnCount = getColumnCount(width)
          const rowCount = getRowCount(columnCount)

          return (
            <Grid
              columnCount={columnCount}
              columnWidth={CARD_WIDTH + PADDING}
              height={height}
              rowCount={rowCount}
              rowHeight={CARD_HEIGHT + PADDING}
              width={width}
            >
              {Cell}
            </Grid>
          )
        }}
      </AutoSizer>
    </div>
  )
}

export default VirtualizedPersonaGrid