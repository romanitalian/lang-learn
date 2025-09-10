import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 12
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 12
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 12
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  }
}

const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ 
    className, 
    cols = 1, 
    gap = 'md',
    responsive,
    children, 
    ...props 
  }, ref) => {
    const baseClasses = 'grid'
    
    const colsClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      12: 'grid-cols-12'
    }
    
    const gapClasses = {
      none: 'gap-0',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8'
    }

    const responsiveClasses = responsive ? Object.entries(responsive)
      .map(([breakpoint, cols]) => {
        const colsMap = {
          1: 'grid-cols-1',
          2: 'grid-cols-2',
          3: 'grid-cols-3',
          4: 'grid-cols-4',
          5: 'grid-cols-5',
          6: 'grid-cols-6',
          12: 'grid-cols-12'
        }
        return `${breakpoint}:${colsMap[cols]}`
      }).join(' ') : ''

    return (
      <div
        className={clsx(
          baseClasses,
          colsClasses[cols],
          gapClasses[gap],
          responsiveClasses,
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Grid.displayName = 'Grid'

// Grid item component
interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  start?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  end?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  responsive?: {
    sm?: { span?: 1 | 2 | 3 | 4 | 5 | 6 | 12; start?: 1 | 2 | 3 | 4 | 5 | 6 | 12; end?: 1 | 2 | 3 | 4 | 5 | 6 | 12 }
    md?: { span?: 1 | 2 | 3 | 4 | 5 | 6 | 12; start?: 1 | 2 | 3 | 4 | 5 | 6 | 12; end?: 1 | 2 | 3 | 4 | 5 | 6 | 12 }
    lg?: { span?: 1 | 2 | 3 | 4 | 5 | 6 | 12; start?: 1 | 2 | 3 | 4 | 5 | 6 | 12; end?: 1 | 2 | 3 | 4 | 5 | 6 | 12 }
    xl?: { span?: 1 | 2 | 3 | 4 | 5 | 6 | 12; start?: 1 | 2 | 3 | 4 | 5 | 6 | 12; end?: 1 | 2 | 3 | 4 | 5 | 6 | 12 }
  }
}

const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  ({ 
    className, 
    span, 
    start, 
    end,
    responsive,
    children, 
    ...props 
  }, ref) => {
    const baseClasses = ''
    
    const spanClasses = span ? `col-span-${span}` : ''
    const startClasses = start ? `col-start-${start}` : ''
    const endClasses = end ? `col-end-${end}` : ''

    const responsiveClasses = responsive ? Object.entries(responsive)
      .map(([breakpoint, config]) => {
        const classes = []
        if (config.span) classes.push(`${breakpoint}:col-span-${config.span}`)
        if (config.start) classes.push(`${breakpoint}:col-start-${config.start}`)
        if (config.end) classes.push(`${breakpoint}:col-end-${config.end}`)
        return classes.join(' ')
      }).join(' ') : ''

    return (
      <div
        className={clsx(
          baseClasses,
          spanClasses,
          startClasses,
          endClasses,
          responsiveClasses,
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GridItem.displayName = 'GridItem'

export { Grid, GridItem }
